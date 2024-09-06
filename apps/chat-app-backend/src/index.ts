import app from "./server";
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
