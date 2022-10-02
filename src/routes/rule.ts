// import Router từ express
import { Router } from "express";

// import hằng số BASE_ROUTES
import { BASE_ROUTES } from "../constants";

// import các controllers
import {
  createRule,
  getAllRules,
  deleteRule,
  getAllRulesCondition,
  createRuleCondition,
  deleteRuleCondition,
} from "../controllers/RuleController";

// Tạo một thể hiện của Router
const router = Router();

// Tạo một luật theo thời gian
router.post(BASE_ROUTES.RULE, createRule);

// Lấy tất cả các luật theo thời gian
router.get(BASE_ROUTES.RULE, getAllRules);

// Xóa một luật theo thời gian
router.delete(BASE_ROUTES.MODIFY_RULES, deleteRule);

// Lấy tất cả các luật phụ thuộc
router.get(BASE_ROUTES.RULE_CONDITION, getAllRulesCondition);

// Tạo một luật phụ thuộc
router.post(BASE_ROUTES.RULE_CONDITION, createRuleCondition);

// Xóa một luật phụ thuộc
router.delete(BASE_ROUTES.MODIFY_RULE_CONDITION, deleteRuleCondition);

// export router ra ngoài để nơi khác dùng được (dùng ở file index)
export default router;
