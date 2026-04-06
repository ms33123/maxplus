const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { resolveRequestPayload } = require("../utils/request");
const { getPublicBootstrap } = require("../services/publicService");
const { createInquiry, createSubscriber } = require("../services/crmService");
const { addLog } = require("../services/systemService");

const router = express.Router();

router.post(
  "/bootstrap",
  asyncHandler(async (req, res) => {
    const data = await getPublicBootstrap();
    return ok(res, data);
  })
);

router.post(
  "/inquiry",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const data = await createInquiry(payload);

    await addLog({
      type: "operation",
      actor: data.customer,
      role: "support",
      message: `新增前台询盘：${data.source} / ${data.customer}`,
      metadata: {
        source: data.source,
        sourceDetail: data.sourceDetail
      }
    });

    return ok(res, data, "询盘提交成功。");
  })
);

router.post(
  "/subscribe",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    const data = await createSubscriber(payload);

    await addLog({
      type: "operation",
      actor: data.email,
      role: "support",
      message: `新增前台订阅：${data.source}`,
      metadata: {
        source: data.source,
        emailStatus: data.emailStatus
      }
    });

    return ok(res, data, "订阅提交成功。");
  })
);

module.exports = router;
