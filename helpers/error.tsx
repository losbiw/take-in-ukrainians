import React from "react";
import { Translate } from "next-translate";
import Error from "@/components/error";

interface GenericBase {
  [key: string]: {
    [key: string]: boolean;
  };
}

const renderErrors = <T extends GenericBase>(
  errorObj: T,
  category: keyof T,
  i18n: {
    t: Translate;
    namespace: string;
  }
) => {
  const errorCategory = errorObj[category];

  return (
    <>
      {Object.keys(errorCategory || {}).map((key) => {
        const errorCondition = errorCategory[key];

        if (errorCondition) {
          return <Error key={key}>{i18n.t(`${i18n.namespace}:${key}`)}</Error>;
        }

        return undefined;
      })}
    </>
  );
};

export default renderErrors;
