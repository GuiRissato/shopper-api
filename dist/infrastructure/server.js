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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./database/connection"));
const migrations_1 = __importDefault(require("./database/migrations"));
const routes_1 = __importDefault(require("./http/routes"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.default.connect().then(() => {
                console.log('Connected to database');
            }).catch((error) => {
                console.log('Error connecting to database', error.message);
            });
            yield (0, migrations_1.default)().then(() => {
                console.log('Database created');
                console.log('Done Migrations');
            }).catch((error) => {
                console.error('error creating tables', error.message);
            });
            routes_1.default.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
        catch (error) {
            console.error('Error during startup:', error);
        }
    });
}
startServer();
