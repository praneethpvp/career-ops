#!/usr/bin/env node
/**
 * generate-tailored-cvs.mjs — Generate 8 tailored HTML CVs for the current LinkedIn batch.
 * Each role gets: custom summary, role-ordered bullets, role-emphasized skills section.
 * Uses the existing CV shell from output/faire-* as structural reference but with current data.
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================
// PER-ROLE SPECS
// ============================
const roles = [
  {
    slug: 'mixpanel-sr-analytics-engineer',
    summary: `Senior Analytics Engineer with 10+ years building production data pipelines, dimensional models, and self-serve analytics platforms at Google, Amazon, Microsoft, and Intuit. Currently own 20+ ETL pipelines and 16+ dashboards across five product lines at Intuit, with deep experience in data quality testing, warehouse-layer transformations (Redshift, BigQuery, Snowflake), and enabling non-technical stakeholders to self-serve insights. Track record of designing attribution and product-usage analytics that directly shape GTM strategy and product roadmap decisions.`,
    intuitTitle: 'Senior Data Analyst &mdash; Analytics Engineering Lead, FinRisk',
    intuitBullets: [
      'Designed and maintained 20+ Superglue ETL pipelines and 8 aggregate tables in Redshift powering fraud-policy analytics across Payments, Payroll, Bill Pay, Banking, and Capital &mdash; the org\'s core data infrastructure layer.',
      'Implemented data quality testing across the full pipeline stack, catching silent failures in legacy Tableau-era pipelines during the QuickSight migration and establishing validation standards adopted org-wide.',
      'Led migration of 10+ dashboards from Tableau to AWS QuickSight, re-engineering 50+ worksheets, translating LOD expressions into level-aware SQL transformations, and building reusable calculation layers for self-serve analytics.',
      'Designed the ONB 2.0 merchant-mapping data model connecting 10+ downstream risk dashboards, partnering with engineering to resolve production defects for a zero-gap rollout.',
    ],
    skillsFocus: 'productAnalytics',
  },
  {
    slug: 'gusto-gtm-analytics-engineer',
    summary: `GTM-focused Analytics Engineer with 10+ years designing data pipelines, KPI frameworks, and self-serve reporting systems at Google, Amazon, Microsoft, and Intuit. Currently own the full pipeline-to-dashboard stack across five product lines at Intuit (20+ ETL pipelines, 16+ dashboards), with direct experience building revenue and campaign analytics that power Go-to-Market strategy. Known for automating manual reporting workflows, establishing foundational data infrastructure, and being the steward of core metric definitions across cross-functional teams.`,
    intuitTitle: 'Senior Data Analyst &mdash; Analytics Engineering, FinRisk',
    intuitBullets: [
      'Built and maintained 20+ Superglue ETL pipelines in Redshift incorporating business logic into raw tables, establishing foundational data infrastructure for fraud-policy analytics across Payments, Payroll, Bill Pay, Banking, and Capital.',
      'Led migration of 10+ dashboards from Tableau to QuickSight, re-engineering 50+ worksheets and creating dynamic reporting environments tailored to Risk, Compliance, and Product stakeholder requirements.',
      'Identified and resolved data discrepancies across legacy pipelines, establishing data quality testing standards and best practices adopted org-wide.',
      'Designed the ONB 2.0 merchant-mapping data model as core steward of metric definitions, connecting 10+ downstream dashboards with a zero-gap production rollout.',
    ],
    skillsFocus: 'gtm',
  },
  {
    slug: 'speak-sr-analytics-engineer',
    summary: `Senior Analytics Engineer with 10+ years building scalable data pipelines, reliable metric definitions, and self-serve analytics platforms at Google, Amazon, Microsoft, and Intuit. Currently own the full data stack across five product lines &mdash; 20+ ETL pipelines, dimensional data models, and 16+ dashboards &mdash; with deep experience in Airflow orchestration, warehouse-layer transformations, and data platform tooling. Passionate about AI-powered products and excited to bring infrastructure rigor to a company at the forefront of AI-driven language learning.`,
    intuitTitle: 'Senior Data Analyst &mdash; Analytics Engineering, FinRisk',
    intuitBullets: [
      'Built and optimized 20+ Superglue ETL pipelines and 8 aggregate tables in Redshift, creating reliable datasets and consistent metric definitions across Payments, Payroll, Bill Pay, Banking, and Capital.',
      'Led evaluation and enhancement of the data tooling ecosystem by migrating 10+ dashboards from Tableau to QuickSight, re-engineering underlying ETL, and implementing data quality observability that caught silent pipeline failures.',
      'Designed the ONB 2.0 merchant-mapping data model supporting business decision-making across 10+ downstream risk dashboards, partnering with engineering on data solutions for a zero-gap rollout.',
      'Built 3 internal Claude Code MCP server integrations &mdash; 10 agents and 12 skills enabling AI-assisted analytics workflows, 10x\'ing team analytical output.',
    ],
    skillsFocus: 'platform',
  },
  {
    slug: 'snowflake-sr-data-analytics-engineer',
    summary: `Senior Data Analytics Engineer with 10+ years architecting internal data platforms and leading cross-functional data initiatives at Google, Amazon, Microsoft, and Intuit. Currently own the analytics infrastructure across five product lines at Intuit &mdash; dimensional models, governance frameworks, ETL pipelines, and regulator-facing reporting &mdash; with hands-on experience establishing dbt-equivalent standards, access-controlled compliance data, and AI-assisted analytics workflows using LLM-powered agents. Proven ability to drive alignment through technical documentation, resolve systemic data quality issues, and influence at principal-level scope.`,
    intuitTitle: 'Senior Data Analyst &mdash; Data Platform &amp; Analytics Engineering, FinRisk',
    intuitBullets: [
      'Architected the analytics data platform across five product lines (Payments, Payroll, Bill Pay, Banking, Capital), designing 8 aggregate tables, 20+ Superglue ETL pipelines, and dimensional models in Redshift that serve as the organization\'s single source of truth.',
      'Drove adoption of AI-assisted analytics workflows by building 3 internal Claude Code MCP server repos &mdash; 10 agents and 12 skills codifying risk-analytics workflows to 10x analytical output.',
      'Established data quality and governance standards across the full pipeline stack &mdash; implementing validation tests during the Tableau-to-QuickSight migration that caught silent failures the legacy infrastructure had been passing through.',
      'Led migration of 10+ dashboards to QuickSight and designed the regulator-facing IDV compliance dashboard answering 11 audit-exam questions, mentoring 2 junior analysts on SQL optimization and dashboard architecture standards.',
    ],
    skillsFocus: 'architecture',
  },
  {
    slug: 'alchemy-data-analytics-engineer',
    summary: `Data Analytics Engineer with 10+ years building canonical data models, transformation layers, and AI-ready data infrastructure at Google, Amazon, Microsoft, and Intuit. Currently own the single source of truth for fraud-policy analytics across five product lines at Intuit &mdash; dimensional models, 20+ ETL pipelines, and production dashboards &mdash; with hands-on experience building MCP (Model Context Protocol) server integrations for conversational data access and AI-assisted analytics workflows. Track record of proactively eliminating redundant datasets, enforcing data quality through rigorous testing, and designing schemas optimized for both human analysis and AI consumption.`,
    intuitTitle: 'Senior Data Analyst &mdash; Data Modeling &amp; Analytics Engineering, FinRisk',
    intuitBullets: [
      'Built and maintained canonical data models in Redshift as the single source of truth for fraud-policy analytics &mdash; 8 aggregate tables and dimensional models across Payments, Payroll, Bill Pay, Banking, and Capital, proactively eliminating redundant datasets.',
      'Built 3 internal MCP server integrations using Claude Code &mdash; 10 agents and 12 skills enabling conversational data access for risk-analytics workflows, with datasets structured for AI tool consumption.',
      'Owned the transformation layer across 20+ Superglue ETL pipelines with rigorous data quality testing, catching silent failures during the Tableau-to-QuickSight migration and establishing validation standards adopted org-wide.',
      'Designed the ONB 2.0 merchant-mapping data model connecting 10+ downstream dashboards, and built the regulator-facing IDV compliance dashboard answering 11 audit-exam questions.',
    ],
    skillsFocus: 'mcp',
  },
  {
    slug: 'google-bi-analyst-sellside',
    summary: `Business Intelligence Analyst and former Googler with 10+ years auditing, deconstructing, and rebuilding legacy data pipelines into scalable BI systems at Google, Amazon, Microsoft, and Intuit. Specialist in transforming fragmented data infrastructure into unified reporting layers &mdash; most recently led the migration of 10+ dashboards and 20+ ETL pipelines at Intuit, and earlier rebuilt legacy pipelines at Microsoft eliminating 95% of data inconsistencies. Experienced applying AI/ML to BI workflows, designing data layers for downstream analytics, and partnering with data providers to establish new pipeline integrations.`,
    intuitTitle: 'Senior Data Analyst, FinRisk Analytics',
    intuitBullets: [
      'Audited, deconstructed, and rebuilt Intuit\'s legacy Tableau reporting infrastructure, migrating 10+ dashboards to AWS QuickSight by re-engineering 50+ worksheets, translating LOD expressions into production-grade SQL transformations, and adding data quality tests that caught issues legacy pipelines had been silently passing.',
      'Designed scalable data layers &mdash; 8 aggregate tables and 20+ Superglue ETL pipelines in Redshift &mdash; supporting fraud-policy analytics across Payments, Payroll, Bill Pay, Banking, and Capital.',
      'Built AI-assisted analytics workflows using Claude Code MCP servers &mdash; 10 agents and 12 skills automating risk-analytics queries and report generation.',
      'Designed the ONB 2.0 merchant-mapping data model, partnering with data providers in engineering to establish new pipeline integrations for a zero-gap production rollout.',
    ],
    skillsFocus: 'bi',
  },
  {
    slug: 'cognition-analytics-engineer',
    summary: `Full-stack Analytics Engineer with 10+ years owning the complete data lifecycle &mdash; from database architecture and pipeline orchestration to business reporting and self-serve analytics &mdash; at Google, Amazon, Microsoft, and Intuit. Currently own the full data stack across five product lines at Intuit: dimensional models, 20+ ETL pipelines, 16+ dashboards, and data quality observability. Strong statistics and experimentation background with A/B testing and statistical validation at Amazon and Microsoft. Excited to bring infrastructure rigor and analytical depth to an AI-first company building the future of software development.`,
    intuitTitle: 'Senior Data Analyst &mdash; Full-Stack Analytics Engineering, FinRisk',
    intuitBullets: [
      'Own the full data stack for FinRisk Policy &amp; Compliance &mdash; designed database architecture (8 aggregate tables, dimensional models in Redshift), built 20+ ETL pipelines (Superglue), and maintain 16+ production dashboards across five product lines.',
      'Built data integrations across internal and external systems for the ONB 2.0 onboarding-risk program, designing the merchant-mapping data model connecting 10+ downstream dashboards with engineering pipeline integrations.',
      'Ensured data quality, observability, and governance by implementing validation testing during the Tableau-to-QuickSight migration, catching silent failures and establishing org-wide standards.',
      'Led migration of 10+ dashboards to QuickSight, owning business reporting end-to-end including datasets, metric definitions, and self-serve analytics for Risk, Compliance, and Product leadership.',
    ],
    skillsFocus: 'fullstack',
  },
  {
    slug: 'okta-sr-analytics-engineer',
    summary: `Senior Analytics Engineer with 10+ years designing scalable data models, establishing consistent business logic, and building analytics infrastructure for Finance, Compliance, and cross-functional teams at Google, Amazon, Microsoft, and Intuit. Currently own dimensional models and semantic foundations across five product lines at Intuit using dbt-equivalent transformations in Snowflake/Redshift, with direct experience preparing high-quality datasets for AI workflows and regulator-facing reporting. Strong mentorship and technical leadership capabilities &mdash; mentor junior analysts and establish team-wide data development standards.`,
    intuitTitle: 'Senior Data Analyst &mdash; Analytics Engineering, FinRisk (Finance &amp; Compliance)',
    intuitBullets: [
      'Designed scalable data models across five product lines (Payments, Payroll, Bill Pay, Banking, Capital) &mdash; 8 aggregate tables and dimensional models in Redshift establishing consistent business logic and semantic foundations for fraud-policy analytics.',
      'Prepared high-quality, AI-ready datasets by building 20+ Superglue ETL pipelines with rigorous data quality testing, governance standards, and validation that caught silent failures in legacy infrastructure.',
      'Built regulator-facing IDV compliance dashboard for Finance and Compliance stakeholders, with the underlying data model powering bi-weekly leadership reviews and weekly compliance cuts.',
      'Mentored 2 junior analysts on SQL optimization, dashboard architecture, and data development best practices, reducing their ramp time by 40% and establishing team-wide development standards.',
    ],
    skillsFocus: 'semantic',
  },
];

// ============================
// SHARED ROLE BLOCKS (identical across resumes)
// ============================
const microsoftMarketing = {
  title: 'Marketing Data Analyst',
  date: 'Oct 2023 &ndash; Sep 2024',
  company: 'Microsoft &mdash; Remote',
  bullets: [
    'Partnered with Product Managers to drive 25+ global campaigns for Azure and Office across APAC, NA, and EMEA, establishing SQL-based KPI frameworks for campaign performance and building audience-segmentation pipelines PMs could self-serve.',
    'Drove a 20% lift in customer engagement and 25% increase in new customer acquisition by surfacing regional performance gaps through automated pipelines and feeding targeting fixes back into campaign strategy.',
    'Collaborated with 4 Product Managers, Data Engineers, and UX designers to translate data insights into concrete in-product recommendations optimized for diverse international markets.',
    'Established the team\'s A/B testing playbook, standardizing how marketing experiments were designed, measured, and reported.',
  ],
};
const amazon = {
  title: 'Business Intelligence Engineer',
  date: 'Aug 2022 &ndash; Aug 2023',
  company: 'Amazon &mdash; Palo Alto, CA',
  bullets: [
    'Led search optimization for US and India marketplaces, defining and monitoring search quality KPIs (CTR, relevance, conversion) with advanced SQL against petabyte-scale datasets to surface user intent gaps that reshaped product roadmap priorities.',
    'Partnered with ML scientists on search ranking refinement, running A/B tests and statistical validation that shipped ranking changes delivering a 20% lift in customer engagement.',
    'Engineered the ETL backbone for marketplace analytics using AWS Glue, S3, and Airflow, aggregating merchant performance, search relevance, and catalog data across US and India into a unified analytical layer adopted by 3 partner teams.',
    'Onboarded and ramped 2 new BIEs on the team\'s data infrastructure and experimentation workflows.',
  ],
};
const microsoftProduct = {
  title: 'Product Analyst',
  date: 'Apr 2020 &ndash; Jan 2022',
  company: 'Microsoft &mdash; Remote',
  bullets: [
    'Rewrote the ETL backing 10 legacy product reports in SQL and Azure Data Studio, eliminating 95% of data inconsistencies that had been driving incorrect downstream decisions.',
    'Built automated reporting that surfaced previously untracked customer revenue, improving identification by 12% and enabling the sales team to reprioritize accounts.',
    'Cut biweekly analytics delivery time by 33% by optimizing reporting workflows in Power BI and SQL, freeing ~8 hours/week of team capacity to redirect toward deeper product analysis.',
  ],
};
const google = {
  title: 'Data Analyst &mdash; Fraud &amp; Risk',
  date: 'Feb 2018 &ndash; Apr 2020',
  company: 'Google &mdash; Mountain View, CA',
  bullets: [
    'Built production Python/ML models for Google Shopping fraud detection that reached 60% recall on abusive orders and cut transactional losses by 50%.',
    'Designed the data models behind fraudulent profile detection, driving a 50% improvement in proactive detection, and deployed Tableau dashboards with auto-alerting so the payments team could act on abuse in real time.',
    'Partnered with engineering and policy to convert model outputs into platform-wide detection rules, tuning precision and coverage to scale fraud defense across high-volume transaction paths.',
  ],
};

// ============================
// SKILLS GROUPS BY FOCUS
// ============================
const skillsVariants = {
  productAnalytics: [
    ['Data Engineering &amp; Modeling', 'dbt (Core) &bull; Apache Airflow &bull; AWS Glue &bull; Superglue &bull; ETL/ELT Pipeline Design &bull; Data Modeling (Star/Snowflake, SCDs) &bull; Data Quality Testing &bull; CI/CD (GitHub Actions)'],
    ['Programming', 'SQL (Redshift, Spark SQL, BigQuery, Snowflake, Athena, T-SQL) &bull; Python (Pandas, NumPy, PySpark, scikit-learn) &bull; R &bull; DAX &bull; JavaScript'],
    ['Cloud &amp; Warehouses', 'AWS (S3, Glue, Athena, Redshift, Lambda, IAM) &bull; BigQuery &bull; Snowflake &bull; Azure (Data Factory, Synapse) &bull; Databricks'],
    ['Analytics', 'Product Analytics &bull; User Behavior Metrics &bull; A/B Testing &bull; Attribution Modeling &bull; KPI Framework Design &bull; Cohort/Funnel Analysis'],
    ['Visualization', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML)'],
    ['AI &amp; Automation', 'Claude Code / MCP servers &bull; agentic analytics tooling &bull; AI-assisted SQL workflows'],
  ],
  gtm: [
    ['Data Engineering', 'dbt (Core) &bull; Apache Airflow &bull; AWS Glue &bull; Superglue &bull; ETL/ELT &bull; Schema Design &bull; Data Modeling (Star/Snowflake, SCDs) &bull; Data Quality &bull; CI/CD (GitHub Actions, Git)'],
    ['Programming', 'SQL (Redshift, Spark SQL, BigQuery, Snowflake, Athena, T-SQL) &bull; Python (Pandas, PySpark, scikit-learn) &bull; R &bull; DAX'],
    ['Cloud &amp; Warehouses', 'AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Snowflake &bull; Azure (Data Factory, Synapse) &bull; Databricks'],
    ['Analytics &amp; GTM', 'KPI Framework Design &bull; Campaign Attribution &bull; A/B Testing &bull; Revenue Analytics &bull; Cohort/Funnel Analysis &bull; Statistical Analysis &bull; Forecasting'],
    ['Visualization', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML)'],
  ],
  platform: [
    ['Data Pipelines &amp; Modeling', 'dbt (Core) &bull; Apache Airflow &bull; AWS Glue &bull; Superglue &bull; ETL/ELT Design &bull; Data Modeling (Star/Snowflake, SCDs) &bull; Data Quality Testing &amp; Observability'],
    ['Programming', 'SQL (Redshift, Spark SQL, BigQuery, Snowflake, Athena, T-SQL) &bull; Python (Pandas, PySpark, scikit-learn) &bull; R'],
    ['Cloud &amp; Warehouses', 'AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Snowflake &bull; Azure (Data Factory, Synapse) &bull; Databricks'],
    ['Data Platform Tooling', 'Ingestion (Fivetran-equivalents via Glue) &bull; Orchestration (Airflow) &bull; Transformation (dbt) &bull; Visualization (Tableau, QuickSight, Looker) &bull; Observability'],
    ['Analytics', 'Product Analytics &bull; A/B Testing &bull; KPI Framework Design &bull; Cohort/Funnel Analysis'],
    ['AI &amp; Automation', 'Claude Code / MCP servers &bull; agentic analytics tooling &bull; AI-assisted SQL workflows'],
  ],
  architecture: [
    ['Data Architecture &amp; Governance', 'Advanced Data Modeling (Star/Snowflake, SCDs) &bull; Access Policy Design &bull; Data Quality &amp; Observability &bull; Governance Frameworks &bull; Technical Documentation'],
    ['dbt &amp; Transformation', 'dbt (Core) &bull; Macro Development &bull; CI/CD (GitHub Actions) &bull; Superglue ETL &bull; ELT Pipeline Design'],
    ['AI &amp; LLM Workflows', 'Claude Code / MCP Servers &bull; Agentic Analytics Agents (10 agents, 12 skills) &bull; AI-Assisted SQL &bull; LLM-Powered Data Tooling &bull; Prompt Engineering'],
    ['Programming', 'SQL (Snowflake, Redshift, Spark SQL, BigQuery, Athena, T-SQL) &bull; Python (Pandas, PySpark, scikit-learn) &bull; R &bull; DAX'],
    ['Cloud &amp; Warehouses', 'Snowflake (Primary) &bull; AWS (S3, Glue, Athena, Redshift, Lambda) &bull; BigQuery &bull; Azure (Synapse, Data Factory) &bull; Databricks'],
    ['Visualization', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML)'],
  ],
  mcp: [
    ['Data Modeling &amp; Transformation', 'Canonical Data Models &bull; Dimensional Modeling (Star/Snowflake, SCDs) &bull; dbt (Core) &bull; Superglue ETL &bull; ELT Pipeline Design &bull; Data Quality Testing &amp; Validation &bull; Schema Design'],
    ['AI &amp; MCP Integrations', 'Model Context Protocol (MCP) Server Development &bull; Claude Code / Agentic Workflows (10 agents, 12 skills) &bull; AI-Assisted SQL &bull; Conversational Data Access &bull; Prompt Engineering'],
    ['Programming', 'SQL (Snowflake, Redshift, Spark SQL, BigQuery, Athena, T-SQL) &bull; Python (Pandas, PySpark, scikit-learn) &bull; R'],
    ['Cloud &amp; Warehouses', 'Snowflake (Primary) &bull; AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Azure (Synapse, Data Factory) &bull; Databricks'],
    ['Visualization', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML)'],
  ],
  bi: [
    ['Programming', 'SQL (Redshift, BigQuery, Spark SQL, Snowflake, Athena, T-SQL &mdash; writing, optimizing, debugging) &bull; Python (Pandas, PySpark, scikit-learn &mdash; scripting, automation) &bull; R &bull; DAX'],
    ['BI &amp; Visualization', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML) &bull; Excel (Advanced)'],
    ['Data Engineering', 'ETL/ELT Pipeline Design &bull; Data Warehouse/Mart Design &bull; Schema Design (Star/Snowflake, SCDs) &bull; dbt &bull; Apache Airflow &bull; AWS Glue &bull; Legacy Pipeline Migration'],
    ['Cloud &amp; Warehouses', 'AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Snowflake &bull; Azure (Data Factory, Synapse)'],
    ['AI/ML for BI', 'Claude Code / MCP Servers &bull; Agentic Analytics Workflows &bull; AI-Assisted SQL &bull; ML Classification Models &bull; Anomaly Detection'],
    ['Analytics', 'A/B Testing &bull; KPI Framework Design &bull; Revenue/Sales Pipeline Reporting &bull; Attribution &bull; Cohort/Funnel Analysis'],
  ],
  fullstack: [
    ['Data Architecture &amp; Pipelines', 'Data Modeling (Star/Snowflake, SCDs) &bull; Warehouse Architecture &bull; BI-Oriented Schema Design &bull; dbt (Core) &bull; Apache Airflow &bull; AWS Glue &bull; Superglue &bull; ETL/ELT Design &bull; CI/CD (GitHub Actions)'],
    ['Programming', 'SQL (Redshift, BigQuery, Spark SQL, Snowflake, Athena, T-SQL &mdash; expert) &bull; Python (Pandas, PySpark, scikit-learn &mdash; strong) &bull; R &bull; DAX'],
    ['Statistics &amp; Experimentation', 'A/B Testing &bull; Experimentation Design &bull; Statistical Analysis &bull; Hypothesis Testing &bull; KPI Framework Design &bull; Cohort/Funnel Analysis'],
    ['BI &amp; Reporting', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML) &bull; Self-Serve Analytics Design'],
    ['Cloud &amp; Warehouses', 'AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Snowflake &bull; Azure (Synapse, Data Factory) &bull; Databricks'],
    ['Data Quality &amp; AI', 'Observability &bull; Governance &bull; Testing &amp; Validation &bull; Claude Code / MCP servers &bull; agentic analytics tooling'],
  ],
  semantic: [
    ['Data Modeling &amp; Semantic Design', 'Dimensional Modeling (Star/Snowflake Schemas, SCDs) &bull; Semantic Layer Design &bull; Consistent Business Logic &bull; Analytics-Ready Data Modeling &bull; dbt (Core) &bull; Superglue ETL'],
    ['Cloud &amp; Warehouses', 'Snowflake (Primary) &bull; AWS (S3, Glue, Athena, Redshift) &bull; BigQuery &bull; Azure (Synapse, Data Factory) &bull; Databricks'],
    ['Programming', 'SQL (Snowflake, Redshift, Spark SQL, BigQuery, Athena, T-SQL) &bull; Python (Pandas, PySpark, scikit-learn) &bull; R &bull; DAX'],
    ['Data Quality &amp; Governance', 'Testing &amp; Validation &bull; Governance Standards &bull; Observability &bull; Data Documentation'],
    ['Visualization &amp; BI', 'Tableau &bull; AWS QuickSight &bull; Power BI (DAX, M) &bull; Looker (LookML)'],
    ['Analytics &amp; AI', 'SaaS Metrics &bull; Finance/Compliance Data &bull; A/B Testing &bull; KPI Framework Design &bull; Claude Code / MCP servers &bull; AI-ready dataset preparation'],
  ],
};

// ============================
// HTML TEMPLATE
// ============================
function htmlFor(spec) {
  const roleBlocks = [
    { title: spec.intuitTitle, date: 'Oct 2024 &ndash; Present', company: 'Intuit &mdash; Mountain View, CA', bullets: spec.intuitBullets },
    microsoftMarketing,
    amazon,
    microsoftProduct,
    google,
  ];
  const skills = skillsVariants[spec.skillsFocus];

  const rolesHTML = roleBlocks.map(r => `
  <div class="role">
    <div class="role-header">
      <span class="role-title">${r.title}</span>
      <span class="role-date">${r.date}</span>
    </div>
    <div class="role-company">${r.company}</div>
    <ul>
${r.bullets.map(b => `      <li>${b}</li>`).join('\n')}
    </ul>
  </div>`).join('\n');

  const skillsHTML = skills.map(([cat, val]) => `    <span class="skill-cat">${cat}</span>\n    <span class="skill-val">${val}</span>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Praneeth Varma - Resume</title>
<style>
  @page { size: letter; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', 'Arial', sans-serif;
    font-size: 9.5pt;
    line-height: 1.35;
    color: #1a1a1a;
    padding: 36px 48px 28px 48px;
    max-width: 8.5in;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header { text-align: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1.5px solid #222; }
  .header h1 { font-size: 18pt; font-weight: 700; letter-spacing: 1.5px; color: #1a1a1a; margin-bottom: 4px; }
  .contact-line { font-size: 8.8pt; color: #444; letter-spacing: 0.2px; }
  .contact-line a { color: #444; text-decoration: none; }
  .sep { margin: 0 5px; color: #aaa; }
  .section { margin-bottom: 10px; }
  .page-break { page-break-before: always; padding-top: 36px; }
  .section-title {
    font-size: 9pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: #1a1a1a;
    border-bottom: 0.75px solid #bbb; padding-bottom: 1px; margin-bottom: 6px;
  }
  .summary p { font-size: 9.2pt; line-height: 1.4; color: #2a2a2a; }
  .role { margin-bottom: 10px; }
  .role:last-child { margin-bottom: 0; }
  .role-header { display: flex; justify-content: space-between; align-items: baseline; }
  .role-title { font-size: 9.6pt; font-weight: 700; color: #1a1a1a; }
  .role-date { font-size: 8.5pt; color: #555; white-space: nowrap; padding-left: 10px; }
  .role-company { font-size: 9pt; font-style: italic; color: #555; margin-bottom: 2px; }
  .role ul { padding-left: 14px; }
  .role li { font-size: 9.2pt; margin-bottom: 2px; line-height: 1.35; color: #2a2a2a; }
  .skills-grid { display: grid; grid-template-columns: 155px 1fr; row-gap: 6px; font-size: 9.2pt; }
  .skill-cat { font-weight: 700; color: #1a1a1a; padding: 2px 0; }
  .skill-val { color: #2a2a2a; padding: 2px 0; line-height: 1.4; }
  .edu-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 9.2pt; margin-bottom: 2px; }
  .edu-left { color: #1a1a1a; }
  .edu-left strong { font-weight: 700; }
  .edu-left em { font-style: italic; color: #555; }
  .edu-right { font-size: 8.5pt; color: #555; }
</style>
</head>
<body>

<div class="header">
  <h1>VENKATA PRANEETH VARMA PENUMATSA</h1>
  <div class="contact-line">
    Fremont, CA<span class="sep">|</span>480-709-0030<span class="sep">|</span>praneeth.verma@gmail.com<span class="sep">|</span><a href="https://linkedin.com/in/praneethvarma">linkedin.com/in/praneethvarma</a><span class="sep">|</span><a href="https://www.praneethvarma.com">praneethvarma.com</a>
  </div>
</div>

<div class="section summary">
  <div class="section-title">Summary</div>
  <p>${spec.summary}</p>
</div>

<div class="section">
  <div class="section-title">Experience</div>
${rolesHTML}
</div>

<div class="section">
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">
${skillsHTML}
  </div>
</div>

<div class="section">
  <div class="section-title">Education</div>
  <div class="edu-row">
    <div class="edu-left"><strong>M.S. Business Analytics</strong> &mdash; <em>Arizona State University, Tempe</em></div>
    <div class="edu-right">GPA: 3.8</div>
  </div>
  <div class="edu-row">
    <div class="edu-left"><strong>B.E. Electronics &amp; Communication</strong> &mdash; <em>Amrita School of Engineering, Bangalore</em></div>
    <div class="edu-right">GPA: 3.5</div>
  </div>
</div>

</body>
</html>
`;
}

// ============================
// WRITE ALL FILES
// ============================
for (const r of roles) {
  const outPath = resolve(__dirname, 'output', `${r.slug}.html`);
  writeFileSync(outPath, htmlFor(r));
  console.log(`✅ Generated: ${r.slug}.html`);
}
console.log(`\nTotal: ${roles.length} HTML resumes written to output/`);
