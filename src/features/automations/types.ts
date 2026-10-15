/** Scénarios d'automatisation (lot 5, section 2.8) : déclencheur, conditions, actions — brouillon et test avant publication. */
export type AutomationStatus = "draft" | "published";

export type AutomationTriggerType = "conversation_opened" | "message_received";

export type AutomationConditionField = "channel" | "message";
export type AutomationConditionOperator = "equals" | "contains";

export type AutomationCondition = {
  field: AutomationConditionField;
  operator: AutomationConditionOperator;
  value: string;
};

export type AutomationActionType = "send_message" | "ask_question" | "assign_user" | "set_contact_attribute";

/** La forme de `config` varie par `type` — voir chaque champ de `AutomationStepConfig`. */
export type AutomationStepConfig = {
  body?: string;
  attribute_key?: string;
  user_id?: string;
  key?: string;
  value?: string;
};

export type AutomationStep = {
  type: AutomationActionType;
  config: AutomationStepConfig;
};

export type AutomationScenario = {
  id: string;
  name: string;
  position: number;
  status: AutomationStatus;
  status_label: string;
  trigger_type: AutomationTriggerType;
  trigger_type_label: string;
  conditions: AutomationCondition[];
  steps: AutomationStep[];
};

export type AutomationTestResult = {
  conditions_matched: boolean;
  steps: { type: AutomationActionType; preview: string }[];
};
