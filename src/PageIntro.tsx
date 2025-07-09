function PageIntro() {
  return (
    <article>
      <h1>Southeast Asia Infrastructure Risk Prototype</h1>
      <p>
        This prototype tool presents infrastructure risk analytics for
        South-East Asia (SEA) using open-data sources on fluvial and coastal
        flooding hazard maps along with cyclone hazard maps. The risks are
        analysed and visualised for power plants, electricity transmission
        lines, road networks, railway networks, ports and airports in SEA. The
        analysis has been undertaken for the World Bank by Oxford Infrastructure
        Analytics Ltd.
      </p>
      <p>
        The purpose of the prototype is to illustrate the type and nature of
        simulation results and network data currently available in the SEA
        region, and how &ndash; using the existing toolchain &ndash; this data
        might be accessed and interrogated at a sub-national, national or
        super-national scale.
      </p>
      <p>
        The modelling and analysis presented here aim to support Disaster Risk
        Finance and Insurance (DRFI) decision-making by identifying spatial
        criticalities and risks under current and future hazard scenarios. It
        comprises a direct damage estimation and an indirect economic loss
        estimation of GDP disruptions due to asset failures and service
        disruption.
      </p>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Infrastructure</th>
            <th>Assets</th>
            <th>Expected Annual Damages (EAD)</th>
            <th>Expected Annual Economic Losses (EAEL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Road</td>
            <td>Road links</td>
            <td>Cost of rehabilitation/reinstating damaged assets</td>
            <td>Macroeconomic losses*</td>
          </tr>
          <tr>
            <td>Rail</td>
            <td>Railway tracks</td>
            <td>Cost of rehabilitation/reinstating damaged assets</td>
            <td>Macroeconomic losses*</td>
          </tr>
          <tr>
            <td>Electricity</td>
            <td>Electricity lines</td>
            <td>Cost of rehabilitation/reinstating damaged assets</td>
            <td>Macroeconomic losses*</td>
          </tr>
        </tbody>
      </table>
      <p>
        <small>
          <em>
            * Macroeconomic losses are computed based on GDP for all regions in
            the Southeast Asia analysis.
          </em>
        </small>
      </p>
      <p>
        The concepts and model results presented here are documented in the
        study report:
      </p>
      <ul>
        <li>
          Pant, R., Russell, T., Glasgow, G., Verschuur, J., Gavin, H., Fowler,
          T. &amp; Hall, J.W. (2021).{" "}
          <em>
            Analytics for Financial Risk Management of Critical Infrastructure
            in Southeast Asia – Final Report.
          </em>{" "}
          Oxford Infrastructure Analytics Ltd., Oxford, UK. Available online at:{" "}
          <a href="https://thedocs.worldbank.org/en/doc/1019bd2696cf0660968910763351f601-0240012021/analytics-for-financial-risk-management-of-critical-infrastructure-in-southeast-asia-scoping-feasibility-study">
            thedocs.worldbank.org/en/doc/1019bd2696cf0660968910763351f601-0240012021/analytics-for-financial-risk-management-of-critical-infrastructure-in-southeast-asia-scoping-feasibility-study
          </a>
        </li>
      </ul>
      <p>Results are archived in the World Bank Data Catalog:</p>
      <ul>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0042426/South-East-Asia-transport-network">
            datacatalog.worldbank.org/search/dataset/0042426/South-East-Asia-transport-network
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0042425/South-East-Asia-electric-grid">
            datacatalog.worldbank.org/search/dataset/0042425/South-East-Asia-electric-grid
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0042422/South-East-Asia-strong-wind-hazard--tropical-cyclone-">
            datacatalog.worldbank.org/search/dataset/0042422/South-East-Asia-strong-wind-hazard--tropical-cyclone-
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0050606/South-East-Asia-strong-wind-risk--tropical-cyclone-">
            datacatalog.worldbank.org/search/dataset/0050606/South-East-Asia-strong-wind-risk--tropical-cyclone-
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0042424/South-East-Asia-coastal-flood-hazard">
            datacatalog.worldbank.org/search/dataset/0042424/South-East-Asia-coastal-flood-hazard
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0050607/South-East-Asia-coastal-flood-risk">
            datacatalog.worldbank.org/search/dataset/0050607/South-East-Asia-coastal-flood-risk
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0042423/South-East-Asia-river-flood-hazard">
            datacatalog.worldbank.org/search/dataset/0042423/South-East-Asia-river-flood-hazard
          </a>
        </li>
        <li>
          <a href="https://datacatalog.worldbank.org/search/dataset/0050609/South-East-Asia-river-flood-risk">
            datacatalog.worldbank.org/search/dataset/0050609/South-East-Asia-river-flood-risk
          </a>
        </li>
      </ul>
      <p>
        The tool being used to visualize the model outputs is developed and
        documented here:
      </p>
      <ul>
        <li>
          <a href="https://github.com/oi-analytics/oi-risk-vis" target="blank">
            github.com/oi-analytics/oi-risk-vis
          </a>
        </li>
      </ul>
      <p>The Southeast Asia analytics are produced using the code here:</p>
      <ul>
        <li>
          <a href="https://github.com/oi-analytics/seasia" target="blank">
            github.com/oi-analytics/seasia
          </a>
        </li>
      </ul>
      <h2>Funding support</h2>
      <p>
        This project is led by the Disaster Risk Financing and Insurance Program
        (DRFIP) of the World Bank with support from the Japan&mdash;World Bank
        Program for Mainstreaming DRM in Developing Countries, which is financed
        by the Government of Japan and managed by the Global Facility for
        Disaster Reduction and Recovery (GFDRR) through the Tokyo Disaster Risk
        Management Hub.
      </p>
      <p>
        <img
          src="logo-drfip.png"
          alt="Disaster Risk Financing and Insurance Program, supported by World Bank Group"
        />
      </p>
    </article>
  );
}

export default PageIntro;
