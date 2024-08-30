"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(db) {
        this.db = db;
    }
    findMeasureByMonth(userId, month, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT * FROM consumption
        WHERE user_id = $1 AND EXTRACT(MONTH FROM created_at) = $2 and type = '${measureType.toLocaleLowerCase()}'
        LIMIT 1
      `;
                const result = yield this.db.query(query, [userId, month]);
                return result.rows[0] || null;
            }
            catch (error) {
                throw new Error(`Failed to find measure by month: ${error.message}`);
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.query(`INSERT INTO users (name, customer_code) VALUES ($1, $2) RETURNING *`, [user.name, user.customer_code]);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
        });
    }
    findByCustomerCode(customer_code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.query(`SELECT * FROM users WHERE customer_code = $1`, [customer_code]);
                return result.rows[0] || null;
            }
            catch (error) {
                throw new Error(`Failed to find user by customer code: ${error.message}`);
            }
        });
    }
}
exports.UserRepository = UserRepository;
