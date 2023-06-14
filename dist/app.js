"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./lib/db"));
const items_1 = __importDefault(require("./routes/items"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use("/api/prod", items_1.default);
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.listen(3000, () => {
    console.log("Serever is started on port 3000");
});
