-- Insert test data into carts table
INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
                                                                    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', NOW(), NOW(), 'OPEN'),
                                                                    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', NOW(), NOW(), 'OPEN'),
                                                                    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', NOW(), NOW(), 'ORDERED'),
                                                                    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'ORDERED');

-- Insert test data into cart_items table
INSERT INTO cart_items (cart_id, product_id, count) VALUES
                                                        ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2),
                                                        ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1),
                                                        ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3),
                                                        ('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1),
                                                        ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5),
                                                        ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10);

-- Test queries to verify data
SELECT * FROM carts;
SELECT * FROM cart_items;

-- Join query to show cart items with their cart information
SELECT c.id as cart_id, c.user_id, c.status, ci.product_id, ci.count
FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
ORDER BY c.created_at DESC;