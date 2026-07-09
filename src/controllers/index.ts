import { Request, Response } from "express";
import { Services } from "../services/index.js";

export class Controller {
  constructor(private readonly authService: Services) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        data: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.logout(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(401).json({
        success: false,
        message,
      });
    }
  }

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.refresh(req.body);
      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  public logoutAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUser = req.user?.userId;
      const result = await this.authService.logoutAll(currentUser);
      res.status(200).json({
        success: true,
        message: "All sessions logged out",
        data: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  public profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUser = req.user?.userId;
      const data = await this.authService.profile(currentUser);
      res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  public profiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.authService.profiles();
      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

