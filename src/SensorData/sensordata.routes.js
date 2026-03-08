'use strict';

import { Router } from "express";
import { recordSensorData } from "./sensordata.controller.js";

const api = Router();

api.post('/', recordSensorData);

export default api;
