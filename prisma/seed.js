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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, teamMember, address, person, corporateClient, wpNumber;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Criação do usuário ADMIN
                return [4 /*yield*/, prisma.user.upsert({
                        where: { email: 'teste@teste.com' },
                        update: {},
                        create: {
                            email: 'teste@teste.com',
                            username: 'teste',
                            password: '$2b$10$H62/bxhk4DJtNkNXzsCNJuDPlFKHiHtHPTkl6eW78IreD/sYCPiQK', // Senha já criptografada
                            isActive: true,
                            createdAt: new Date(),
                            role: client_1.Role.ADMIN,
                            termsAccepted: true,
                        },
                    })];
                case 1:
                    // Criação do usuário ADMIN
                    _a.sent();
                    return [4 /*yield*/, prisma.config.findFirst()];
                case 2:
                    config = _a.sent();
                    if (!!config) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.config.create({
                            data: {
                                name: 'Sistema XYZ',
                                email: 'suporte@teste.com',
                                mobile: '11987654321',
                                phone1: '1133334444',
                                phone2: '1133335555',
                                place: 'Rua Teste, 123',
                                number: '123',
                                complement: 'Sala 1',
                                neighborhood: 'Bairro Teste',
                                city: 'São Paulo',
                                state: 'SP',
                                zipCode: '12345678',
                            },
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, prisma.teamMembers.create({
                        data: {
                            name: 'Carlos Silva',
                            workStartTime: new Date('2024-11-24T08:00:00'),
                            workEndTime: new Date('2024-11-24T17:00:00'),
                            discountLimit: 5.0,
                            commissionRate: 10.0,
                            position: 'Atendente',
                            hireDate: new Date(),
                            salary: 3000.0,
                        },
                    })];
                case 5:
                    teamMember = _a.sent();
                    return [4 /*yield*/, prisma.address.create({
                            data: {
                                street: 'Rua Teste',
                                number: '123',
                                neighborhood: 'Bairro Teste',
                                city: 'São Paulo',
                                state: 'SP',
                                zipCode: '12345678',
                            },
                        })];
                case 6:
                    address = _a.sent();
                    return [4 /*yield*/, prisma.person.create({
                            data: {
                                name: 'João da Silva',
                                email: 'joao@teste.com',
                                phone1: '551187654321',
                                birthDate: new Date('1985-05-15'),
                                notes: 'Cliente VIP',
                                defaulter: false,
                                addressId: address.id, // Relacionando com o endereço criado
                            },
                        })];
                case 7:
                    person = _a.sent();
                    return [4 /*yield*/, prisma.corporateClient.create({
                            data: {
                                personId: person.id, // Relacionando com a pessoa criada
                                name: 'Empresa XYZ Ltda',
                                email: 'contato@xyz.com',
                                phone1: '1133334444',
                                phone2: '1133335555',
                            },
                        })];
                case 8:
                    corporateClient = _a.sent();
                    return [4 /*yield*/, prisma.wpNumber.create({
                            data: {
                                number: '5511987654321',
                            },
                        })];
                case 9:
                    wpNumber = _a.sent();
                    main()
                        .catch(function (e) {
                        console.error(e);
                        process.exit(1);
                    })
                        .finally(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.$disconnect()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
