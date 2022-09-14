import { Router } from "express";

import { BASE_ROUTES } from "../constants";
import {
  createRule,
  getAllRules,
  deleteRule,
  getAllRulesCondition,
  createRuleCondition,
  deleteRuleCondition,
} from "../controllers/RuleController";

const router = Router();

router.post(BASE_ROUTES.RULE, createRule);

router.get(BASE_ROUTES.RULE, getAllRules);

router.delete(BASE_ROUTES.MODIFY_RULES, deleteRule);

router.get(BASE_ROUTES.RULE_CONDITION, getAllRulesCondition);

router.post(BASE_ROUTES.RULE_CONDITION, createRuleCondition);

router.delete(BASE_ROUTES.MODIFY_RULE_CONDITION, deleteRuleCondition);

export default router;
