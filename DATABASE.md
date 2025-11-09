# 🗄️ Database Schema Documentation

## Entity-Relationship Diagram

```
┌─────────────────┐
│     VENDORS     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ phone           │
│ address         │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐        ┌─────────────────┐
│    INVOICES     │        │   CUSTOMERS     │
├─────────────────┤        ├─────────────────┤
│ id (PK)         │        │ id (PK)         │
│ invoice_number  │◄───N:1─┤ name            │
│ vendor_id (FK)  │        │ email           │
│ customer_id(FK) │        │ phone           │
│ issue_date      │        │ address         │
│ due_date        │        │ created_at      │
│ total_amount    │        │ updated_at      │
│ status          │        └─────────────────┘
│ category        │
│ description     │
│ tax_amount      │
│ subtotal        │
│ created_at      │
│ updated_at      │
└────┬─────┬──────┘
     │     │
  1:N│     │1:N
     │     │
┌────▼──────────┐  ┌─────▼──────────┐
│  LINE_ITEMS   │  │    PAYMENTS    │
├───────────────┤  ├────────────────┤
│ id (PK)       │  │ id (PK)        │
│ invoice_id(FK)│  │ invoice_id(FK) │
│ description   │  │ amount         │
│ quantity      │  │ payment_date   │
│ unit_price    │  │ method         │
│ amount        │  │ reference      │
└───────────────┘  │ created_at     │
                   └────────────────┘
```

## Tables

### vendors

Stores vendor/supplier information.

| Column     | Type      | Constraints | Description               |
| ---------- | --------- | ----------- | ------------------------- |
| id         | UUID      | PRIMARY KEY | Unique vendor identifier  |
| name       | VARCHAR   | NOT NULL    | Vendor company name       |
| email      | VARCHAR   | NULLABLE    | Vendor email address      |
| phone      | VARCHAR   | NULLABLE    | Vendor phone number       |
| address    | VARCHAR   | NULLABLE    | Vendor physical address   |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation timestamp |
| updated_at | TIMESTAMP | AUTO UPDATE | Record update timestamp   |

**Relationships:**

- Has many `invoices`

---

### customers

Stores customer information.

| Column     | Type      | Constraints | Description                  |
| ---------- | --------- | ----------- | ---------------------------- |
| id         | UUID      | PRIMARY KEY | Unique customer identifier   |
| name       | VARCHAR   | NOT NULL    | Customer company/person name |
| email      | VARCHAR   | NULLABLE    | Customer email address       |
| phone      | VARCHAR   | NULLABLE    | Customer phone number        |
| address    | VARCHAR   | NULLABLE    | Customer address             |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation timestamp    |
| updated_at | TIMESTAMP | AUTO UPDATE | Record update timestamp      |

**Relationships:**

- Has many `invoices`

---

### invoices

Core table storing invoice information.

| Column         | Type          | Constraints           | Description                                     |
| -------------- | ------------- | --------------------- | ----------------------------------------------- |
| id             | UUID          | PRIMARY KEY           | Unique invoice identifier                       |
| invoice_number | VARCHAR       | UNIQUE, NOT NULL      | Invoice number (e.g., INV-001234)               |
| vendor_id      | UUID          | FOREIGN KEY, NOT NULL | Reference to vendor                             |
| customer_id    | UUID          | FOREIGN KEY, NULLABLE | Reference to customer                           |
| issue_date     | TIMESTAMP     | NOT NULL              | Date invoice was issued                         |
| due_date       | TIMESTAMP     | NOT NULL              | Payment due date                                |
| total_amount   | DECIMAL(12,2) | NOT NULL              | Total invoice amount                            |
| status         | VARCHAR       | DEFAULT 'pending'     | Invoice status (pending/paid/overdue/cancelled) |
| category       | VARCHAR       | NULLABLE              | Invoice category (Software/Hardware/etc)        |
| description    | VARCHAR       | NULLABLE              | Invoice description                             |
| tax_amount     | DECIMAL(12,2) | NULLABLE              | Tax amount                                      |
| subtotal       | DECIMAL(12,2) | NULLABLE              | Subtotal before tax                             |
| created_at     | TIMESTAMP     | DEFAULT NOW           | Record creation timestamp                       |
| updated_at     | TIMESTAMP     | AUTO UPDATE           | Record update timestamp                         |

**Relationships:**

- Belongs to one `vendor`
- Belongs to one `customer` (optional)
- Has many `line_items`
- Has many `payments`

**Indexes:**

- `vendor_id` (for vendor queries)
- `customer_id` (for customer queries)
- `status` (for filtering)
- `issue_date` (for date range queries)

**Constraints:**

- ON DELETE CASCADE for vendor (if vendor deleted, invoices deleted)
- ON DELETE SET NULL for customer (if customer deleted, invoices remain)

---

### line_items

Stores individual line items within invoices.

| Column      | Type          | Constraints           | Description                             |
| ----------- | ------------- | --------------------- | --------------------------------------- |
| id          | UUID          | PRIMARY KEY           | Unique line item identifier             |
| invoice_id  | UUID          | FOREIGN KEY, NOT NULL | Reference to invoice                    |
| description | VARCHAR       | NOT NULL              | Item description                        |
| quantity    | DECIMAL(10,2) | NOT NULL              | Item quantity                           |
| unit_price  | DECIMAL(12,2) | NOT NULL              | Price per unit                          |
| amount      | DECIMAL(12,2) | NOT NULL              | Line item total (quantity × unit_price) |

**Relationships:**

- Belongs to one `invoice`

**Indexes:**

- `invoice_id` (for invoice queries)

**Constraints:**

- ON DELETE CASCADE (if invoice deleted, line items deleted)

---

### payments

Stores payment records for invoices.

| Column       | Type          | Constraints           | Description                                    |
| ------------ | ------------- | --------------------- | ---------------------------------------------- |
| id           | UUID          | PRIMARY KEY           | Unique payment identifier                      |
| invoice_id   | UUID          | FOREIGN KEY, NOT NULL | Reference to invoice                           |
| amount       | DECIMAL(12,2) | NOT NULL              | Payment amount                                 |
| payment_date | TIMESTAMP     | NOT NULL              | Date payment was made                          |
| method       | VARCHAR       | NOT NULL              | Payment method (Bank Transfer/Credit Card/etc) |
| reference    | VARCHAR       | NULLABLE              | Payment reference/transaction ID               |
| created_at   | TIMESTAMP     | DEFAULT NOW           | Record creation timestamp                      |

**Relationships:**

- Belongs to one `invoice`

**Indexes:**

- `invoice_id` (for invoice queries)

**Constraints:**

- ON DELETE CASCADE (if invoice deleted, payments deleted)

---

## Common Queries

### Get all invoices with vendor details

```sql
SELECT i.*, v.name as vendor_name
FROM invoices i
JOIN vendors v ON i.vendor_id = v.id
ORDER BY i.issue_date DESC;
```

### Get invoice with all line items

```sql
SELECT i.*, li.*
FROM invoices i
LEFT JOIN line_items li ON i.id = li.invoice_id
WHERE i.invoice_number = 'INV-001234';
```

### Get total spend per vendor

```sql
SELECT v.name, SUM(i.total_amount) as total_spend
FROM invoices i
JOIN vendors v ON i.vendor_id = v.id
GROUP BY v.name
ORDER BY total_spend DESC;
```

### Get overdue invoices

```sql
SELECT *
FROM invoices
WHERE due_date < CURRENT_DATE
  AND status != 'paid'
ORDER BY due_date ASC;
```

### Get payment history for an invoice

```sql
SELECT p.*, i.invoice_number, i.total_amount
FROM payments p
JOIN invoices i ON p.invoice_id = i.id
WHERE i.id = 'invoice-uuid-here'
ORDER BY p.payment_date DESC;
```

---

## Data Integrity Rules

1. **Referential Integrity**

   - All foreign keys enforce referential integrity
   - Cascade deletes for dependent records
   - SET NULL for optional relationships

2. **Business Rules**

   - Invoice total_amount must be positive
   - Due date must be after issue date
   - Payment amount cannot exceed invoice total
   - Status must be one of: pending, paid, overdue, cancelled

3. **Audit Trail**
   - All tables have created_at timestamp
   - Modified tables have updated_at timestamp
   - Soft deletes can be implemented if needed

---

## Indexes Strategy

### Performance Indexes

- Foreign keys are automatically indexed
- Frequently filtered columns (status, date ranges)
- Columns used in JOINs

### Query Optimization

- Use EXPLAIN ANALYZE for slow queries
- Monitor query performance in production
- Add indexes based on actual usage patterns

---

## Backup & Recovery

### Backup Strategy

```bash
# Full database backup
pg_dump -U postgres -d flobit_analytics > backup.sql

# Restore from backup
psql -U postgres -d flobit_analytics < backup.sql
```

### Point-in-Time Recovery

- Enable WAL archiving in PostgreSQL
- Configure backup retention policy
- Test restore procedures regularly

---

## Migration History

Managed by Prisma:

```bash
# View migration status
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy
```

---

## Data Seeding

See `apps/api/prisma/seed.ts` for:

- Sample data generation
- JSON data import
- Test data creation

Run seeding:

```bash
npm run db:seed
```

---

## Security Considerations

1. **Connection Security**

   - Use SSL for database connections
   - Store credentials in environment variables
   - Rotate passwords regularly

2. **Access Control**

   - Use least privilege principle
   - Create read-only users for reporting
   - Audit database access logs

3. **Data Privacy**
   - Encrypt sensitive fields if needed
   - Implement data retention policies
   - Comply with data protection regulations

---

## Scaling Considerations

### For High Volume

- Partition large tables by date
- Use read replicas for reporting
- Implement connection pooling
- Archive old data periodically

### Monitoring

- Track query performance
- Monitor table size growth
- Set up alerts for slow queries
- Use EXPLAIN for query optimization
