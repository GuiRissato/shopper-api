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
                const date = new Date(measureDatetime);
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // getMonth() retorna 0 para janeiro, precisamos adicionar 1
                // Chamando o repositório para buscar a medida
                const measure = yield this.userRepository.findMeasureByMonth(user.id, year, month, measureType);
                return measure;
            }
            catch (error) {
                throw new Error(`Failed to find measure by month: ${error.message}`);
            }
        });
    }
}
exports.UserService = UserService;
