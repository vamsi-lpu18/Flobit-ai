# Data Directory

This directory contains the Analytics_Test_Data.json file used to seed the database.

## Setup Instructions

1. **Download the data file** from the Google Drive link provided in the assignment
2. **Save it as** `Analytics_Test_Data.json` in this directory
3. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

## File Structure

# Analytics Test Data

## ✅ Data File Ready

The `Analytics_Test_Data.json` file is now in this directory and ready to use!

## 📊 Data Structure

The JSON file contains an array of invoice documents with the following structure:

- **Document Metadata**: ID, name, status, timestamps
- **Vendor Information**: Name, address, tax ID
- **Customer Information**: Name, address
- **Invoice Details**: Invoice number, dates, amounts
- **Line Items**: Product/service descriptions, quantities, prices
- **Payment Information**: Due dates, payment terms, bank details
- **Summary**: Subtotal, tax, and total amounts

## 🚀 How to Use

The seed script (`apps/api/prisma/seed.ts`) will automatically:

1. ✅ Read this JSON file
2. ✅ Parse the complex nested structure
3. ✅ Extract vendor, customer, invoice, and line item data
4. ✅ Create normalized database records
5. ✅ Handle relationships between tables
6. ✅ Assign categories and statuses intelligently

## 📝 Running the Seed Script

```bash
# From the project root
cd apps/api
npm run db:seed

# Or using the root script
npm run db:seed
```

## 📈 Expected Results

After seeding, you should have:

- **Vendors**: Unique vendors extracted from invoices
- **Customers**: Unique customers extracted from invoices
- **Invoices**: All processed invoices with proper relationships
- **Line Items**: Detailed line items for each invoice
- **Payments**: Payment records for completed invoices

## 🔍 Data Quality

The seed script includes:

- ✅ Intelligent data extraction from nested JSON
- ✅ Duplicate vendor/customer detection
- ✅ Data normalization (absolute values for amounts)
- ✅ Smart status assignment (paid/pending/overdue)
- ✅ Category inference based on vendor names
- ✅ Error handling for malformed records

## 🎯 Next Steps

1. Make sure PostgreSQL is running
2. Configure your `.env` file with `DATABASE_URL`
3. Run `npx prisma db push` to create tables
4. Run `npm run db:seed` to populate the database
5. Start the application and view the data in the dashboard!

---

**Note**: The actual Analytics_Test_Data.json file contains thousands of invoice records providing rich, real-world data for the analytics dashboard.

See `Analytics_Test_Data.json` for the expected structure.
