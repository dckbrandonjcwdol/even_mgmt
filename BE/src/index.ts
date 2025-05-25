import express, { Application, Request, Response } from 'express';
import cors from "cors";
import path from "path";


const PORT: number = 8000;


const app: Application = express();
app.use(express.json())

app.use(cors());  


app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
    // res.send('Hello World!');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
