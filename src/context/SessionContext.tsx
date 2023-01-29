import { createContext } from 'react';
import { User } from '../models/Session';


export const StateContext = createContext<User | null>(null);