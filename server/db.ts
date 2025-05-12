import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

// Cấu hình kết nối MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'watch_ar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection()
    .then(connection => {
        console.log('Đã kết nối thành công đến MySQL');
        connection.release();
    })
    .catch(err => {
        console.error('Lỗi kết nối đến MySQL:', err);
    });

export const db = {
    // USERS
    async getUsers() {
        const [rows] = await pool.execute('SELECT * FROM users') as [any[], any];
        return rows;
    },
    async getUserById(id: number) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]) as [any[], any];
        return rows[0];
    },
    async getUserByUsername(username: string) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]) as [any[], any];
        return rows[0];
    },
    async getUserByEmail(email: string) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];
        return rows[0];
    },
    async createUser(user: schema.InsertUser) {
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)',
            [user.username, user.password, user.email, user.name]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...user };
    },
    async updateUser(id: number, user: Partial<schema.InsertUser>) {
        const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');
        const values = Object.values(user);
        await pool.execute(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
        return db.getUserById(id);
    },
    async deleteUser(id: number) {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return true;
    },

    // WATCHES
    async getWatches(category?: string) {
        if (category && category !== 'all') {
            const [rows] = await pool.execute(
                'SELECT * FROM watches WHERE category = ?', [category]
            ) as [any[], any];
            return rows;
        } else {
            const [rows] = await pool.execute('SELECT * FROM watches') as [any[], any];
            return rows;
        }
    },
    async getWatchById(id: number) {
        const [rows] = await pool.execute('SELECT * FROM watches WHERE id = ?', [id]) as [any[], any];
        return rows[0];
    },
    async createWatch(watch: schema.InsertWatch) {
        const [result] = await pool.execute(
            'INSERT INTO watches (name, brand, description, price, image_url, model_url, category, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [watch.name, watch.brand, watch.description, watch.price, watch.imageUrl, watch.modelUrl, watch.category, watch.inStock]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...watch };
    },
    async updateWatch(id: number, watch: Partial<schema.InsertWatch>) {
        const fields = Object.keys(watch).map(key => `${key} = ?`).join(', ');
        const values = Object.values(watch);
        await pool.execute(`UPDATE watches SET ${fields} WHERE id = ?`, [...values, id]);
        return db.getWatchById(id);
    },
    async deleteWatch(id: number) {
        await pool.execute('DELETE FROM watches WHERE id = ?', [id]);
        return true;
    },

    // ORDERS
    async getUserOrders(userId: number) {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ?', [userId]) as [any[], any];
        return rows;
    },
    async getOrderById(id: number) {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]) as [any[], any];
        return rows[0];
    },
    async createOrder(order: schema.InsertOrder) {
        const [result] = await pool.execute(
            'INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, NOW())',
            [order.userId, order.totalAmount, order.status]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...order };
    },
    async updateOrderStatus(id: number, status: string) {
        await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return db.getOrderById(id);
    },

    // ORDER ITEMS
    async getOrderItems(orderId: number) {
        const [rows] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]) as [any[], any];
        return rows;
    },
    async createOrderItem(orderItem: schema.InsertOrderItem) {
        const [result] = await pool.execute(
            'INSERT INTO order_items (order_id, watch_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderItem.orderId, orderItem.watchId, orderItem.quantity, orderItem.price]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...orderItem };
    },

    // WAITLIST
    async getWaitlistSignups() {
        const [rows] = await pool.execute('SELECT * FROM waitlist_signups') as [any[], any];
        return rows;
    },
    async getWaitlistSignupByEmail(email: string) {
        const [rows] = await pool.execute('SELECT * FROM waitlist_signups WHERE email = ?', [email]) as [any[], any];
        return rows[0];
    },
    async createWaitlistSignup(signup: schema.InsertWaitlistSignup) {
        const [result] = await pool.execute(
            'INSERT INTO waitlist_signups (name, email, company) VALUES (?, ?, ?)',
            [signup.name, signup.email, signup.company]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...signup };
    },

    // ASSETS (for AR models)
    async getARModels() {
        const [rows] = await pool.execute(
            'SELECT * FROM assets WHERE category = "model-3d"'
        ) as [any[], any];
        return rows;
    },
    async getARModelById(id: number) {
        const [rows] = await pool.execute(
            'SELECT * FROM assets WHERE id = ? AND category = "model-3d"',
            [id]
        ) as [any[], any];
        return rows[0];
    },
    async createAsset(asset: schema.InsertAsset) {
        const [result] = await pool.execute(
            'INSERT INTO assets (file_name, file_type, file_size, file_url, original_name, mime_type, category, related_product_id, public_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [asset.fileName, asset.fileType, asset.fileSize, asset.fileUrl, asset.originalName, asset.mimeType, asset.category, asset.relatedProductId, asset.publicUrl]
        ) as [mysql.ResultSetHeader, any];
        return { id: result.insertId, ...asset };
    },
    async getAssetsByProductId(productId: number) {
        const [rows] = await pool.execute('SELECT * FROM assets WHERE related_product_id = ?', [productId]) as [any[], any];
        return rows;
    },
    async deleteAsset(id: number) {
        await pool.execute('DELETE FROM assets WHERE id = ?', [id]);
        return true;
    }
};

export { pool };