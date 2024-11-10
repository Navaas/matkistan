import express from "express";

export const app = express();

app.use(express.json());

// app.use("/api/posts", postsRouter);

//error handler
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.log(err);
//   res.status(500).json("Ett oväntat fel har uppstått");
// });
