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
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByCustomerCode(userData.customer_code);
            if (existingUser) {
                throw new Error('Customer code already exists');
            }
            const user = yield this.userRepository.create(userData);
            return user;
        });
    }
    findMeasureByMonth(customerCode, measureDatetime, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByCustomerCode(customerCode);
                if (!user) {
                    throw new Error('User not found');
                }
                const measure = yield this.userRepository.findMeasureByMonth(user.id, measureDatetime, measureType);
                return measure;
            }
            catch (error) {
                throw new Error(`Failed to find measure by month: ${error.message}`);
            }
        });
    }
    findUserByCustomerCode(customerCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByCustomerCode(customerCode);
                return user;
            }
            catch (error) {
                throw new Error(`Erro ao buscar usuário por código de cliente: ${error.message}`);
            }
        });
    }
}
exports.UserService = UserService;
