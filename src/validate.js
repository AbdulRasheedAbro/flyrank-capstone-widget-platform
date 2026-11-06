const { z } = require('zod');
const SubmissionSchema = z.object({
  widgetId: z.string().uuid(),
  data: z.record(z.string(), z.union([z.string().max(2000), z.number(), z.boolean()])),
  _hp: z.string().optional()
});
const WidgetSchema = z.object({
  type: z.enum(['signup', 'contact', 'cta', 'popover']),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  fields: z.array(z.object({ name: z.string().min(1).max(40), label: z.string().min(1).max(80) })).optional(),
  button_text: z.string().max(40).optional()
});
module.exports = { SubmissionSchema, WidgetSchema };