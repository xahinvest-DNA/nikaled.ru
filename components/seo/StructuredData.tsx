type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

export const StructuredData = ({ data }: { data: JsonLd }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);