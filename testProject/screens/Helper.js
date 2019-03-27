export const rpd = (v1, v2) => {
  return Math.abs(v1 - v2) / ((+v1 + +v2) / 2);
};

export const supplied = (match, grade) => {
  return match ? ((match * grade) / 100).toFixed(0) : "&ndash;";
};

export const calculateIndividualScore = (sn, sp, sk, recN, recP, recK) => {
  let sc;

  if (sn + sp + sk == 0) {
    return 0;
  }
  sc = 100;

  if (recN > 0 && sn == 0) {
    sc -= 25;
  } else if (recN > 0 && (sn < 0.9 * recN || sn > 1.1 * recN)) {
    sc -= 10 * rpd(sn, recN);
  } else {
    sc -= 5 * rpd(sn, recN);
  }

  if (recP > 0 && sp == 0) {
    sc -= 25;
  } else if (sp > recP * 1.05) {
    sc -= 20 * rpd(sp, recP);
  } else {
    sc -= 10 * rpd(sp, recP);
  }

  if (recK > 0 && sk == 0) {
    sc -= 25;
  } else if (sk < recK) {
    sc -= 20 * rpd(sk, recK);
  } else {
    sc -= 10 * rpd(sk, recK);
  }

  return Math.min(100, Math.max(0, sc)).toFixed(0);
};
