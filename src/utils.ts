const compareRuleTime = (rule1: any, rule2: any) => {
  const [_, minute1, hour1] = rule1.time.split(" ");
  const [__, minute2, hour2] = rule2.time.split(" ");

  const minuteSum1 = Number(hour1) * 60 + Number(minute1);
  const minuteSum2 = Number(hour2) * 60 + Number(minute2);

  return minuteSum1 - minuteSum2;
};

export { compareRuleTime };
