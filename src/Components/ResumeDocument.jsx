import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const INK   = '#000000'
const BODY  = '#1a1a1a'
const MUTED = '#333333'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: BODY,
    backgroundColor: '#ffffff',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 36,
  },

  name: {
    fontFamily: 'Times-Bold',
    fontSize: 22,
    color: INK,
    textAlign: 'center',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 2,
  },
  contactItem: { fontSize: 9, color: MUTED },
  contactSep:  { fontSize: 9, color: '#aaa', marginHorizontal: 5 },

  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    color: INK,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 7,
    marginBottom: 1,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: INK,
    marginBottom: 3,
  },

  entryBlock: { marginBottom: 4 },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryLeft:    { flex: 1, paddingRight: 8 },
  entryRight:   { fontSize: 9, color: MUTED, textAlign: 'right', flexShrink: 0 },
  entryHeading: { fontFamily: 'Times-Bold', fontSize: 10, color: INK },
  entryItalic:  { fontFamily: 'Times-Italic', fontSize: 10, color: INK },

  coursework:      { fontSize: 9, color: MUTED, marginLeft: 10, marginTop: 1 },
  courseworkLabel: { fontFamily: 'Times-Bold', color: INK },

  skillRow:   { flexDirection: 'row', marginBottom: 2 },
  skillLabel: { fontFamily: 'Times-Bold', fontSize: 9.5, color: INK },
  skillVal:   { flex: 1, fontSize: 9.5, color: MUTED },

  bullet:     { flexDirection: 'row', marginTop: 1 },
  bulletDot:  { width: 10, fontSize: 9, color: INK, textAlign: 'center' },
  bulletText: { flex: 1, fontSize: 9, color: MUTED, lineHeight: 1.3 },
  bulletBold: { fontFamily: 'Times-Bold', color: INK },
})

const safe    = (val, fallback = '') => val ?? fallback
const safeArr = (arr) => Array.isArray(arr) ? arr : []

const Bullets = ({ items }) =>
  safeArr(items).map((b, i) => (
    <View key={i} style={s.bullet}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>{b}</Text>
    </View>
  ))

const Section = ({ title, children }) => (
  <View>
    <Text style={s.sectionTitle}>{title}</Text>
    <View style={s.rule} />
    {children}
  </View>
)

function ResumeDocument({ resume }) {
  if (!resume) return null

  const { contact = {}, experience, projects, education, skills = {} } = resume

  const contactItems = [
    safe(contact.email),
    safe(contact.phone),
    safe(contact.linkedin),
    safe(contact.github),
    safe(contact.portfolio),
  ].filter(Boolean)

  const skillRows = [
    ['Languages',     skills.languages],
    ['Frameworks',    skills.frameworks],
    ['Databases',     skills.databases],
    ['Tools',         skills.tools],
    ['Methodologies', skills.methodologies],
    ['Other',         skills.other],
  ].filter(([, arr]) => safeArr(arr).length > 0)

  return (
    <Document title={`${safe(contact.name, 'Resume')} - Resume`} author={safe(contact.name)}>
      <Page size="A4" style={s.page}>

        <Text style={s.name}>{safe(contact.name, 'Your Name')}</Text>

        <View style={s.contactRow}>
          {contactItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              <Text style={s.contactItem}>{item}</Text>
              {i < contactItems.length - 1 && <Text style={s.contactSep}>|</Text>}
            </View>
          ))}
        </View>

        {safeArr(education).length > 0 && (
          <Section title="Education">
            {safeArr(education).map((edu, i) => (
              <View key={i} style={s.entryBlock}>
                <View style={s.entryHeaderRow} wrap={false}>
                  <Text style={s.entryLeft}>
                    <Text style={s.entryHeading}>{safe(edu.degree)}</Text>
                    {edu.institution
                      ? <Text style={s.entryItalic}>, {edu.institution}</Text>
                      : null}
                  </Text>
                  <Text style={s.entryRight}>
                    {[
                      [safe(edu.startDate), safe(edu.endDate)].filter(Boolean).join(' – '),
                      safe(edu.location),
                    ].filter(Boolean).join('  |  ')}
                  </Text>
                </View>
                {safeArr(edu.details).length > 0 && (
                  <Text style={s.coursework}>
                    <Text style={s.courseworkLabel}>Coursework: </Text>
                    {edu.details.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {skillRows.length > 0 && (
          <Section title="Technical Skills">
            {skillRows.map(([cat, arr]) => (
              <View key={cat} style={s.skillRow} wrap={false}>
                <Text style={s.skillVal}>
                  <Text style={s.skillLabel}>{cat}: </Text>
                  {safeArr(arr).join(', ')}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {safeArr(experience).length > 0 && (
          <Section title="Professional Experience">
            {safeArr(experience).map((exp, i) => (
              <View key={i} style={s.entryBlock}>
                <View style={s.entryHeaderRow} wrap={false}>
                  <Text style={s.entryLeft}>
                    <Text style={s.entryHeading}>{safe(exp.company)}</Text>
                    {exp.title
                      ? <Text style={s.entryItalic}>, {exp.title}</Text>
                      : null}
                  </Text>
                  <Text style={s.entryRight}>
                    {[
                      [safe(exp.startDate), safe(exp.endDate)].filter(Boolean).join(' – '),
                      safe(exp.location),
                    ].filter(Boolean).join('  |  ')}
                  </Text>
                </View>
                <Bullets items={exp.bullets} />
              </View>
            ))}
          </Section>
        )}

        {safeArr(projects).length > 0 && (
          <Section title="Projects">
            {safeArr(projects).map((proj, i) => (
              <View key={i} style={s.entryBlock}>
                <View style={s.entryHeaderRow} wrap={false}>
                  <Text style={s.entryLeft}>
                    <Text style={s.entryHeading}>{safe(proj.name)}</Text>
                    {proj.description
                      ? <Text style={s.entryItalic}>, {proj.description}</Text>
                      : null}
                  </Text>
                </View>
                <Bullets items={proj.bullets} />
                {safeArr(proj.techStack).length > 0 && (
                  <View style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>
                      <Text style={s.bulletBold}>Tech Stack: </Text>
                      {proj.techStack.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

      </Page>
    </Document>
  )
}

export default ResumeDocument
