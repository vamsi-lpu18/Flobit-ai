import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// Interface for the actual Analytics_Test_Data.json structure
interface AnalyticsDocument {
  _id: string;
  name: string;
  status: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  extractedData?: {
    llmData?: {
      invoice?: {
        value?: {
          invoiceId?: { value: string };
          invoiceDate?: { value: string };
          deliveryDate?: { value: string };
        };
      };
      vendor?: {
        value?: {
          vendorName?: { value: string };
          vendorAddress?: { value: string };
          vendorTaxId?: { value: string };
          vendorPartyNumber?: { value: string };
        };
      };
      customer?: {
        value?: {
          customerName?: { value: string };
          customerAddress?: { value: string };
        };
      };
      payment?: {
        value?: {
          dueDate?: { value: string };
          paymentTerms?: { value: string };
          bankAccountNumber?: { value: string };
          netDays?: { value: number };
        };
      };
      summary?: {
        value?: {
          subTotal?: { value: number };
          totalTax?: { value: number };
          invoiceTotal?: { value: number };
          currencySymbol?: { value: string };
        };
      };
      lineItems?: {
        value?: {
          items?: {
            value?: Array<{
              description?: { value: string };
              quantity?: { value: number };
              unitPrice?: { value: number };
              totalPrice?: { value: number };
              Sachkonto?: { value: string };
            }>;
          };
        };
      };
    };
  };
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();

  // Load JSON data
  const dataPath = join(process.cwd(), "../../data/Analytics_Test_Data.json");
  let documents: AnalyticsDocument[] = [];

  try {
    const fileContent = readFileSync(dataPath, "utf-8");
    documents = JSON.parse(fileContent);
    console.log(`📦 Loaded ${documents.length} documents from JSON file`);
  } catch (error) {
    console.error("❌ Error reading data file:", error);
    console.log("⚠️  File should be at: " + dataPath);
    console.log(
      "⚠️  Please download Analytics_Test_Data.json and place it in the data/ directory"
    );
    process.exit(1);
  }

  // Process data
  const vendorMap = new Map<string, string>(); // name -> id
  const customerMap = new Map<string, string>(); // name -> id
  let processedCount = 0;
  let skippedCount = 0;

  for (const doc of documents) {
    try {
      // Skip if no extracted data
      if (!doc.extractedData?.llmData) {
        skippedCount++;
        continue;
      }

      const llmData = doc.extractedData.llmData;

      // Extract invoice data
      const invoiceId =
        llmData.invoice?.value?.invoiceId?.value || doc._id.substring(0, 8);
      const invoiceDate =
        llmData.invoice?.value?.invoiceDate?.value || doc.createdAt.$date;
      const dueDate =
        llmData.payment?.value?.dueDate?.value ||
        llmData.invoice?.value?.deliveryDate?.value ||
        doc.createdAt.$date;

      // Extract vendor data
      const vendorName =
        llmData.vendor?.value?.vendorName?.value || "Unknown Vendor";
      const vendorAddress = llmData.vendor?.value?.vendorAddress?.value;
      const vendorTaxId = llmData.vendor?.value?.vendorTaxId?.value;

      // Extract customer data
      const customerName = llmData.customer?.value?.customerName?.value;
      const customerAddress = llmData.customer?.value?.customerAddress?.value;

      // Extract summary/amounts
      const totalAmount = llmData.summary?.value?.invoiceTotal?.value || 0;
      const subTotal = llmData.summary?.value?.subTotal?.value || 0;
      const taxAmount = llmData.summary?.value?.totalTax?.value || 0;

      // Create or get vendor
      let vendorId: string;
      if (vendorMap.has(vendorName)) {
        vendorId = vendorMap.get(vendorName)!;
      } else {
        const vendor = await prisma.vendor.create({
          data: {
            name: vendorName,
            email: vendorTaxId
              ? `billing@${vendorName.toLowerCase().replace(/\s+/g, "")}.com`
              : undefined,
            address: vendorAddress,
          },
        });
        vendorId = vendor.id;
        vendorMap.set(vendorName, vendorId);
      }

      // Create or get customer (if exists)
      let customerId: string | undefined;
      if (customerName) {
        if (customerMap.has(customerName)) {
          customerId = customerMap.get(customerName)!;
        } else {
          const customer = await prisma.customer.create({
            data: {
              name: customerName,
              address: customerAddress,
            },
          });
          customerId = customer.id;
          customerMap.set(customerName, customerId);
        }
      }

      // Determine status based on amount and dates
      const status = determineStatus(totalAmount, new Date(dueDate));
      const category = assignCategory(vendorName);

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: invoiceId,
          vendorId,
          customerId,
          issueDate: new Date(invoiceDate),
          dueDate: new Date(dueDate),
          totalAmount: Math.abs(totalAmount), // Use absolute value
          status,
          category,
          description: doc.name,
          taxAmount: Math.abs(taxAmount),
          subtotal: Math.abs(subTotal),
        },
      });

      // Create line items
      const lineItemsData = llmData.lineItems?.value?.items?.value;
      if (
        lineItemsData &&
        Array.isArray(lineItemsData) &&
        lineItemsData.length > 0
      ) {
        const validLineItems = lineItemsData
          .filter((item) => item.description?.value)
          .map((item) => ({
            invoiceId: invoice.id,
            description: item.description!.value,
            quantity: item.quantity?.value || 1,
            unitPrice: Math.abs(item.unitPrice?.value || 0),
            amount: Math.abs(item.totalPrice?.value || 0),
          }));

        if (validLineItems.length > 0) {
          await prisma.lineItem.createMany({
            data: validLineItems,
          });
        }
      }

      // Create payment if status is paid
      if (status === "paid" && totalAmount > 0) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: Math.abs(totalAmount),
            paymentDate: new Date(invoiceDate),
            method: "Bank Transfer",
            reference: invoiceId,
          },
        });
      }

      processedCount++;

      if (processedCount % 100 === 0) {
        console.log(`   ⏳ Processed ${processedCount} invoices...`);
      }
    } catch (error) {
      console.error(`Error processing document ${doc._id}:`, error);
      skippedCount++;
    }
  }

  console.log("\n✅ Database seeded successfully!");
  console.log(`   📊 Vendors: ${vendorMap.size}`);
  console.log(`   👥 Customers: ${customerMap.size}`);
  console.log(`   🧾 Invoices processed: ${processedCount}`);
  console.log(`   ⚠️  Invoices skipped: ${skippedCount}`);
}

function determineStatus(amount: number, dueDate: Date): string {
  const today = new Date();

  // If negative amount, it's a credit note (paid/completed)
  if (amount < 0) {
    return "paid";
  }

  // Check due date
  if (dueDate < today) {
    // Random distribution for overdue vs paid
    return Math.random() > 0.3 ? "paid" : "overdue";
  }

  // Future invoices - mix of pending and paid
  return Math.random() > 0.5 ? "pending" : "paid";
}

function assignCategory(vendorName: string): string {
  const lowerName = vendorName.toLowerCase();

  // Smart category assignment based on vendor name keywords
  if (
    lowerName.includes("software") ||
    lowerName.includes("tech") ||
    lowerName.includes("digital")
  ) {
    return "Software";
  }
  if (
    lowerName.includes("hardware") ||
    lowerName.includes("computer") ||
    lowerName.includes("equipment")
  ) {
    return "Hardware";
  }
  if (lowerName.includes("consult") || lowerName.includes("advisory")) {
    return "Consulting";
  }
  if (
    lowerName.includes("marketing") ||
    lowerName.includes("media") ||
    lowerName.includes("advertis")
  ) {
    return "Marketing";
  }
  if (lowerName.includes("office") || lowerName.includes("supplies")) {
    return "Office Supplies";
  }

  // Default random assignment for others
  const categories = [
    "Software",
    "Hardware",
    "Services",
    "Consulting",
    "Marketing",
    "Office Supplies",
  ];
  const hash = vendorName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return categories[hash % categories.length];
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
