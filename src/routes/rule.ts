import { Router } from "express";
import { BASE_ROUTES } from "../constants";
import { createRule, getAllRules, deleteRule } from "../controllers/RuleController";

const router = Router();

router.post(BASE_ROUTES.RULE, createRule);
router.get(BASE_ROUTES.RULE, getAllRules);
router.delete(BASE_ROUTES.UPDATE_DELETE_RULES, deleteRule);

export default router;
