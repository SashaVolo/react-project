import {createRoot} from 'react-dom/client'; 
import { App } from './App'; 
import img from "./assets/readmeImg/Preview.png"

const rootElement = document.getElementById('root') as HTMLElement;


const root = createRoot(rootElement);


root.render(<App />);