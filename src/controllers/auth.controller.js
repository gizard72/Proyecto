import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {createAccesToken} from '../libs/jwt.js';

  
export const register = async (req, res) => {
    const {email,password, username} = req.body;

    try {
        //HASHEAR CONTRASEÑA
        const passwordHash = await bcrypt.hash(password,8)

        const newUser = new User ({
            username,
            email,
            password: passwordHash,
        });
        
        const userSaved = await newUser.save(); //guarda usuario
        const token = await createAccesToken({id: userSaved._id}); //crear token
        res.cookie('token',token); //estableces en una cookie la respuesta
        res.json({
           id: userSaved._id,
           username: userSaved.username,
            email:userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        }); //enviar respuesta
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const {email,password} = req.body;

    try {
        //LOGIN
        const userFound = await User.findOne({email});
        if (!userFound) return res.status(400).json({message: "User not found"});

        //COMPARAR CONTRASEÑA
        const isMatch = await bcrypt.compare(password,userFound.password);
        if (!isMatch) return res.status(400).json({message: "Incorrect password"});
        
        const token = await createAccesToken({id: userFound._id}); //crear token

        res.cookie('token',token); //estableces en una cookie la respuesta
        res.json({
           id: userFound._id,
           username: userFound.username,
            email:userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        }); //enviar respuesta
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token',"",{
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

export const profile = (req,res) => {
     const userFound = User.findById(req.user.id)
     if (!userFound) return res.status(400).json({message: "User not found"});
     return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
     })
    res.send('profile')
};
