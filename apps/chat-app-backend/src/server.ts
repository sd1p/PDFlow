import express, { urlencoded, json } from "express";
import { notFound } from "./middleware/notFound";
import { error } from "./middleware/error";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

// ... other middlewares and routes ...

app.use(notFound);
app.use(error);

export default app;
