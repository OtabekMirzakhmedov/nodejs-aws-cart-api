-- Create enum type for cart status
CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
                                     id UUID PRIMARY KEY,
                                     user_id UUID NOT NULL,
                                     created_at TIMESTAMP NOT NULL,
                                     updated_at TIMESTAMP NOT NULL,
                                     status cart_status NOT NULL
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
                                          cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    count INTEGER NOT NULL CHECK (count > 0),
    PRIMARY KEY (cart_id, product_id)
    );