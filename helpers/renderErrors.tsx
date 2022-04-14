import React from "react";
import { Translate } from "next-translate";
import Error from "@/components/general/error";

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
    namespace?: string;
  }
) => {
  const errorCategory = errorObj[category];

  return (
    <>
      {Object.keys(errorCategory || {}).map((key) => {
        const errorCondition = errorCategory[key];

        if (errorCondition) {
          const { t, namespace } = i18n;
          return (
            <Error key={key}>
              {t(`${namespace ? `${namespace}:` : ""}${key}`)}
            </Error>
          );
        }

        return undefined;
      })}
    </>
  );
};

export default renderErrors;
