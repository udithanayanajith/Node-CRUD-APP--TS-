import { Router, Request, Response } from "express";
import DrugModel from "../model/drugs";
import express from "express";
const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//geAllDrugs
router.get("/all", async (req, res) => {
  try {
    let allDrugs = await DrugModel.find({}, { _id: 1, gName: 1, dBrand: 1 });
    if (!allDrugs) {
      return res.status(422).json({ error: "Drugs list is empty" });
    }
    res.json(allDrugs);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

//add drugs
router.post("/addDrugs", async (req, res) => {
  const data = {
    gName: req.body.d_name,
    dBrand: req.body.d_brand,
  };
  console.log(data);

  try {
    const check = await DrugModel.findOne({
      gName: req.body.d_name,
      dBrand: req.body.d_brand,
    });
    if (check) {
      return res.status(422).json({ error: "Drug already exists" });
    }
    await DrugModel.insertMany([data]);
    return res.status(201).json({
      message: "Drug inserted successfully fom user :",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in server, Please check entered data" });
  }
});

//allOptions

router.get("/allOptions", async (req: Request, res: Response) => {
  try {
    const jsonResponse: { options: any[] } = { options: [] };

    const distinctNames = await DrugModel.distinct("gName");
    jsonResponse.options = jsonResponse.options.concat(
      (distinctNames as unknown) as any[]
    );

    const distinctBrands = await DrugModel.distinct("dBrand");
    jsonResponse.options = jsonResponse.options.concat(
      (distinctBrands as unknown) as any[]
    );

    res.json(jsonResponse);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

//seacrch
router.get("/searchDrugs", async (req, res) => {
  try {
    let searchTerm = req.query.item;
    if (searchTerm === "" || searchTerm === null) {
      return res.status(409).json("There is no Please Enter a serach item");
    }
    const serachDrug = await DrugModel.find({
      $or: [{ gName: searchTerm }, { dBrand: searchTerm }],
    });
    if (serachDrug && serachDrug.length > 0) {
      res.json(serachDrug);
    } else {
      return res
        .status(409)
        .json("There is no such kind of Drug name or brand");
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

//Update
router.put("/updateDrug", async (req, res) => {
  // const id = req.query.id;
  const { id, d_name, d_brand } = req.body;
  try {
    const existingDrug = await DrugModel.findById(id);
    if (!existingDrug) {
      return res.status(409).json({ error: "Wrong ID " + id });
    }

    const duplicateDrug = await DrugModel.findOne({
      gName: d_name,
      dBrand: d_brand,
    });
    if (duplicateDrug) {
      return res.status(409).json({ error: "Drug already exists" });
    }

    existingDrug.gName = d_name;
    existingDrug.dBrand = d_brand;
    await existingDrug.save();

    return res.status(201).json({ message: "Drug updated successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Failed to update data into the database" });
  }
});

//delete
router.delete("/deleteDrug", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Drug ID is missing in the request query." });
  }

  try {
    const drug = await DrugModel.findById(id);

    if (!drug) {
      return res.status(404).json({ error: "Drug not found" });
    }

    await DrugModel.deleteOne({ _id: id });

    res.json({
      message: "Drug deleted successfully by user: ",
    });
  } catch (error) {
    console.error("Error deleting drug:", error);
    res.status(500).json({ error: "Error deleting drug" });
  }
});
export default router;
