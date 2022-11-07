import { getRepository } from "typeorm";
import Orphanage from "../models/Orphanage";
import { Request, Response } from "express";
import orphanageView from "../views/orphanages_view";
import * as Yup from "yup";

export const getInstitutions = async (request: Request, response: Response) => {
  const institutionsRepository = getRepository(Orphanage);
  const institutions = await institutionsRepository.find({
    relations: ["images"],
  });

  return response.json(orphanageView.renderMany(institutions));
};

export const getInstitution = async (request: Request, response: Response) => {
  const { id } = request.params;
  const institutionsRepository = getRepository(Orphanage);
  const orphanage = await institutionsRepository.findOneOrFail(id, {
    relations: ["images"],
  });

  return response.json(orphanageView.render(orphanage));
};

export const createInstitution = async (request: Request, response: Response) => {
  const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } =
    request.body;

  const institutionsRepository = getRepository(Orphanage);

  const requestImages = request.files as Express.Multer.File[]; // to solve multer typing problem when using array of files
  const images = requestImages.map((image) => {
    return { path: image.filename };
  });

  const data = {
    name,
    latitude,
    longitude,
    about,
    instructions,
    opening_hours,
    open_on_weekends,
    images,
  };

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
    about: Yup.string().required().max(300),
    instructions: Yup.string().required(),
    opening_hours: Yup.string().required(),
    open_on_weekends: Yup.boolean().required(),
    images: Yup.array(
      Yup.object().shape({
        path: Yup.string().required(),
      })
    ),
  });

  await schema.validate(data, {
    abortEarly: false,
  });

  const orphanage = institutionsRepository.create(data);

  await institutionsRepository.save(orphanage);

  return response.status(201).json(orphanage);
};

export const updateInstitution = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } =
    request.body;

  const institutionsRepository = getRepository(Orphanage);

  const requestImages = request.files as Express.Multer.File[]; // to solve multer typing problem when using array of files
  const images = requestImages.map((image) => {
    return { path: image.filename };
  });

  const data = {
    name,
    latitude,
    longitude,
    about,
    instructions,
    opening_hours,
    open_on_weekends,
    images,
  };

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    latitude: Yup.number().required(),
    longitude: Yup.number().required(),
    about: Yup.string().required().max(300),
    instructions: Yup.string().required(),
    opening_hours: Yup.string().required(),
    open_on_weekends: Yup.boolean().required(),
    images: Yup.array(
      Yup.object().shape({
        path: Yup.string().required(),
      })
    ),
  });

  await schema.validate(data, {
    abortEarly: false,
  });

  const orphanage = institutionsRepository.create(data);

  await institutionsRepository.update(id, orphanage);
  /*
    await institutionsRepository.update(13, {
    name: "SACRA Centro Educativo Terapéutico Escuela de Educación Especial N° 8180",
    instructions: "Visítenos de lunes a viernes de 8:00 a 18:00 hs.",
    latitude: -24.795479216961457,
    longitude: -65.41304417243569,
    about: "SACRA es una entidad benéfica y sin ánimo de lucro, con el objetivo de promover el desarrollo integral e inclusión social participativa de personas con discapacidad, siempre trabajando junto a las familias. La Institución cuenta con los servicios de Atención Temprana, Escuela Especial, Centro Educativo Terapéutico, Inclusión Escolar y Formación Profesional.",
    open_on_weekends: false,
    opening_hours: "8:00 a 18:00 hs.",
  });
  */

  return response.status(201).json(orphanage);
}