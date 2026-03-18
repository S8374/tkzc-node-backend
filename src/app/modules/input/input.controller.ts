import { Request, Response } from "express";
import { FormFieldService } from "./input.services";
import httpStatus from "http-status-codes";

export const createFormField = async (req: Request, res: Response) => {
  console.log (req.body)
  const result = await FormFieldService.createField(req.body);

  res.status(201).json({
    success: true,
    message: "Form field created",
    data: result,
  });
};

export const getFormFields = async (req: Request, res: Response) => {
  const { paymentMethodId } = req.params;

  const result = await FormFieldService.getFieldsByPaymentMethod(
    paymentMethodId
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};
export const getFromInputByType = async (req: Request, res: Response) => {
  const { tab } = req.params;

  const result = await FormFieldService.getInputByTab(tab);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
};
export const updateFormField = async (req: Request, res: Response) => {
  const result = await FormFieldService.updateField(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Field updated",
    data: result,
  });
};

export const deleteFormField = async (req: Request, res: Response) => {
  await FormFieldService.deleteField(req.params.id);

  res.status(200).json({
    success: true,
    message: "Field deleted",
  });
};