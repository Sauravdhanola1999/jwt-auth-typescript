import { Request, Response } from "express";
import services from "../services/index.js";

class Controller {
  // Handle user registration
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await services.register(req.body);
      res.status(201).json({
        success: true,
        message: "User Registered SuccessFully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Handle user login
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await services.login(req.body);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await services.logout(req.body);
      res.status(200).json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await services.refresh(req.body);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  logoutAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUser = req.user.userId;
      const result = await services.logoutAll(currentUser);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  profile = async(req: Request, res: Response): Promise<void> => {
    try {
      const currentUser = req.user.userId;
      const data = await services.profile(currentUser);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: data,
      });
    } catch (error: any) {
            res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  profiles = async (req:Request, res: Response): Promise<void> => {
    try {
      const data = await services.profiles();
        res.status(200).json({
        success: true,
        message: "Data fetched Successfully",
        data: data,
      });
    } catch (error: any) {
        res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

}

export default new Controller();
