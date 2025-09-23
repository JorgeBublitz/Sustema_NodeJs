import express from "express";
import routes from "./routes/indexRoutes"

const app = express();

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
