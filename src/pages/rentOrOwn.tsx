import styled from "@emotion/styled";
import { MathJax } from "better-react-mathjax";
import { useState } from "react";

import { Footer } from "../components/footer";
import { InputTable, VarType } from "../components/inputTable";
import { TitleBar } from "../components/titleBar";
import { FlexCol, FlexColC, HR2, Page } from "../stylePrimitives";

const maxPageWidth = "1440px";

const Frame = styled(FlexCol)`
  align-items: center;
  gap: 1em;
`;

function fixedDecimals(value: number, decimals: number = 2) {
  const f = Math.pow(10, decimals);
  return (Math.round(value * f) / f).toFixed(decimals);
}

export const RentOrOwnPage = () => {
  const [vars, setVars] = useState({
    principal: { value: 750000 },
    interestYearly: { value: 5 },
    mortgageTerm: { value: 360 }
  } as VarType);

  const [costs, setCosts] = useState({
    propertyTaxYearly: { value: 8000 },
    insuranceYearly: { value: 1000 },
    other: { value: 0 }
  } as VarType);

  const [info, setInfo] = useState({
    incomeTaxRate: { value: 0.3, step: "0.1" }
  } as VarType);

  const interestMonthlyDisplay = fixedDecimals(vars["interestYearly"].value / 12);

  const interestMonthlyDecimal = vars["interestYearly"].value / 1200;
  const expFactor = Math.pow(1 + interestMonthlyDecimal, vars["mortgageTerm"].value);
  const mortgageMonthly = (vars["principal"].value * (interestMonthlyDecimal * expFactor)) / (expFactor - 1);

  const interestAmount = vars["principal"].value * interestMonthlyDecimal;
  const interestAmountDisplay = fixedDecimals(interestAmount, 2);

  const principalAmount = mortgageMonthly - interestAmount;
  const principalAmountDisplay = fixedDecimals(principalAmount, 2);

  const mortgageMonthlyDisplay = fixedDecimals(mortgageMonthly, 2);

  const formulaDisplay = `${mortgageMonthlyDisplay} = ${vars["principal"].value} frac(${interestMonthlyDisplay}%(1 + ${interestMonthlyDisplay}%)^${vars["mortgageTerm"].value})((1 + ${interestMonthlyDisplay}%)^${vars["mortgageTerm"].value} – 1)`;

  const costToOwn = mortgageMonthly + (costs["propertyTaxYearly"].value + costs["insuranceYearly"].value) / 12;
  const costToOwnDisplay = fixedDecimals(costToOwn, 2);

  const costsFormula = `"Cost" = "Mortgage" + "Tax" + "Insurance" + "Other"`;
  const costsFormula2 = `${costToOwnDisplay} = ${mortgageMonthlyDisplay} + frac(${costs["propertyTaxYearly"].value} + ${costs["insuranceYearly"].value} + ${costs["other"].value})(12)`;

  const taxDeductions = interestAmount + (costs["propertyTaxYearly"].value / 12) * (1 - info["incomeTaxRate"].value);
  const taxDeductionsDisplay = fixedDecimals(taxDeductions, 2);
  const taxesFormula = `"TaxSav" = "Interest" + "PropTax"*"IncTax"`;
  const taxesFormula2 = `${taxDeductionsDisplay} = ${interestAmountDisplay} + frac(${costs["propertyTaxYearly"].value})(12)*(1-${info["incomeTaxRate"].value})`;

  const incomeTaxRate = 0.3;
  const maxRentInclTaxes = costToOwn - taxDeductions * (1 - incomeTaxRate);
  const maxRentInclTaxesDisplay = fixedDecimals(maxRentInclTaxes, 2);

  return (
    <Page maxWidth={maxPageWidth}>
      <Frame>
        <TitleBar title="Rent or Own" />
        <MathJax
          renderMode={"pre"}
          typesettingOptions={{ fn: "asciimath2chtml" }}
          text={formulaDisplay}
          inline
          dynamic
        />
        <InputTable inputs={vars} setInputs={setVars} />

        <HR2 />

        <MathJax renderMode={"pre"} typesettingOptions={{ fn: "asciimath2chtml" }} text={costsFormula} inline dynamic />
        <MathJax
          renderMode={"pre"}
          typesettingOptions={{ fn: "asciimath2chtml" }}
          text={costsFormula2}
          inline
          dynamic
        />
        <InputTable inputs={costs} setInputs={setCosts} />

        <span>
          Renting for less than <b>${costToOwnDisplay}</b> beats out ownership from a cashflow perspective.
        </span>
        <MathJax renderMode={"pre"} typesettingOptions={{ fn: "asciimath2chtml" }} text={taxesFormula} inline dynamic />
        <MathJax
          renderMode={"pre"}
          typesettingOptions={{ fn: "asciimath2chtml" }}
          text={taxesFormula2}
          inline
          dynamic
        />

        <InputTable inputs={info} setInputs={setInfo} />
        <span>
          Renting for less than <b>${maxRentInclTaxesDisplay}</b> beats out primary residence ownership from a tax
          perspective.
        </span>

        <HR2 />
        <span>More Info | Links</span>
        <FlexColC>
          <a href="https://www.irs.gov/taxtopics/tc503">IRS</a>
          <a href="https://www.bankrate.com/real-estate/how-to-claim-property-tax-deductions/#work">Bankrate article</a>
        </FlexColC>
        <Footer />
      </Frame>
    </Page>
  );
};
