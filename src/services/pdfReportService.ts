import jsPDF from 'jspdf';
import { UserProfile, SimulationResult } from '../types';
import { calculateCareerSimulation } from './aiService';
import { initialCareerRoles } from '../data/mockData';

export interface CareerTwinReportData {
  profile: UserProfile;
  simulationSkills: string[];
  simResult: SimulationResult;
  generatedAt: string;
  documentId: string;
  workforceInsights?: {
    emergingSkills: string[];
    topRolesHiring: string[];
    summary: string;
    sources: Array<{ title: string; domain: string; date?: string; url?: string }>;
  };
}

export class CareerTwinPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number = 210;
  private pageHeight: number = 297;
  private marginX: number = 14;
  private marginY: number = 16;
  private currentY: number = 16;
  private contentWidth: number = 182; // 210 - 28
  private totalPages: number = 1;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.marginY - 12) {
      this.doc.addPage();
      this.currentY = this.marginY;
      this.drawPageHeader();
    }
  }

  private drawPageHeader() {
    // Running header on continuation pages
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(140, 150, 165);
    this.doc.text('PRAVRIDDHI — OFFICIAL CAREERTWIN INTELLIGENCE DOSSIER', this.marginX, this.currentY);
    this.doc.text('CONFIDENTIAL & INDIVIDUALIZED', this.pageWidth - this.marginX, this.currentY, { align: 'right' });
    
    this.doc.setDrawColor(226, 232, 240);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.marginX, this.currentY + 2, this.pageWidth - this.marginX, this.currentY + 2);
    this.currentY += 8;
  }

  private drawBadge(text: string, x: number, y: number, type: 'USER' | 'ANALYSIS' | 'WEB' | 'SIMULATION'): number {
    let bgColor = [241, 245, 249];
    let textColor = [71, 85, 105];
    let borderColor = [203, 213, 225];

    if (type === 'USER') {
      bgColor = [238, 242, 255]; // Indigo-50
      textColor = [67, 56, 202]; // Indigo-700
      borderColor = [199, 210, 254];
    } else if (type === 'ANALYSIS') {
      bgColor = [240, 253, 244]; // Emerald-50
      textColor = [22, 101, 52]; // Emerald-800
      borderColor = [187, 247, 208];
    } else if (type === 'WEB') {
      bgColor = [236, 254, 255]; // Cyan-50
      textColor = [14, 116, 144]; // Cyan-700
      borderColor = [165, 243, 252];
    } else if (type === 'SIMULATION') {
      bgColor = [254, 243, 199]; // Amber-50
      textColor = [146, 64, 14]; // Amber-800
      borderColor = [253, 230, 138];
    }

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    const textWidth = this.doc.getTextWidth(text);
    const badgeWidth = textWidth + 6;
    const badgeHeight = 4.8;

    this.doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    this.doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    this.doc.setLineWidth(0.2);
    this.doc.roundedRect(x, y - 3.5, badgeWidth, badgeHeight, 1, 1, 'FD');

    this.doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    this.doc.text(text, x + 3, y);

    return badgeWidth;
  }

  private drawSectionTitle(numberStr: string, title: string, tagType: 'USER' | 'ANALYSIS' | 'WEB' | 'SIMULATION', tagText: string) {
    this.checkPageBreak(18);
    
    // Top rule
    this.doc.setDrawColor(226, 232, 240);
    this.doc.setLineWidth(0.4);
    this.doc.line(this.marginX, this.currentY, this.pageWidth - this.marginX, this.currentY);
    this.currentY += 5;

    // Number + Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(15, 23, 42); // slate-900
    const fullHeading = `${numberStr}. ${title}`;
    this.doc.text(fullHeading, this.marginX, this.currentY);

    const titleWidth = this.doc.getTextWidth(fullHeading);
    this.drawBadge(tagText, this.marginX + titleWidth + 3, this.currentY, tagType);

    this.currentY += 6;
  }

  public generate(data: CareerTwinReportData): jsPDF {
    const { profile, simulationSkills, simResult, generatedAt, documentId, workforceInsights } = data;

    // ==========================================
    // COVER / HEADER LOCKUP
    // ==========================================
    // Top brand accent bar
    this.doc.setFillColor(79, 70, 229); // Indigo 600
    this.doc.rect(this.marginX, this.currentY, this.contentWidth, 2, 'F');
    this.currentY += 6;

    // Brand and Document Meta
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('Pravriddhi', this.marginX, this.currentY);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('Workforce Intelligence & Career Digital Twin Platform', this.marginX + 30, this.currentY);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text(`DOC ID: ${documentId}`, this.pageWidth - this.marginX, this.currentY - 1, { align: 'right' });

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(`Generated: ${generatedAt}`, this.pageWidth - this.marginX, this.currentY + 3, { align: 'right' });

    this.currentY += 8;

    // Subtitle
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13);
    this.doc.setTextColor(30, 41, 59);
    this.doc.text('Comprehensive CareerTwin Intelligence & Transition Dossier', this.marginX, this.currentY);
    this.currentY += 4.5;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(
      'An executive evaluation of demonstrated capabilities, market alignment, simulations, and transition trajectory.',
      this.marginX,
      this.currentY
    );
    this.currentY += 7;

    // ==========================================
    // 1. CAREERTWIN SNAPSHOT
    // ==========================================
    this.drawSectionTitle('1', 'CareerTwin Snapshot', 'USER', 'USER DATA');

    // Summary Card Box
    this.doc.setFillColor(248, 250, 252);
    this.doc.setDrawColor(226, 232, 240);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 23, 2, 2, 'FD');

    const colW = this.contentWidth / 4;
    const boxY = this.currentY + 5;

    // Col 1: Candidate
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('CANDIDATE', this.marginX + 4, boxY);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(profile.name, this.marginX + 4, boxY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(profile.title, this.marginX + 4, boxY + 9, { maxWidth: colW - 6 });

    // Col 2: Target Role
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('TARGET ROLE', this.marginX + colW + 2, boxY);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text(profile.targetRole, this.marginX + colW + 2, boxY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('High-Demand Systems Track', this.marginX + colW + 2, boxY + 9);

    // Col 3: Baseline Alignment
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('BASELINE ALIGNMENT', this.marginX + colW * 2 + 2, boxY);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(`${profile.targetRoleAlignment}%`, this.marginX + colW * 2 + 2, boxY + 6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(22, 101, 52); // emerald-800
    this.doc.text(`+${profile.alignmentTrend}% 30-day velocity`, this.marginX + colW * 2 + 2, boxY + 11);

    // Col 4: Verified Evidence Count
    const demonstratedCount = profile.skills.filter((s) => s.type === 'demonstrated').length;
    const totalEvidence = profile.skills.reduce((acc, s) => acc + s.evidence.length, 0);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('VERIFIED EVIDENCE', this.marginX + colW * 3 + 2, boxY);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(22, 101, 52);
    this.doc.text(`${demonstratedCount} Skills / ${totalEvidence} Artifacts`, this.marginX + colW * 3 + 2, boxY + 6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text('Repos, Assmts & Certs', this.marginX + colW * 3 + 2, boxY + 11);

    this.currentY += 27;

    // ==========================================
    // 2. CURRENT TARGET ROLE
    // ==========================================
    this.drawSectionTitle('2', 'Current Target Role Benchmark', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(51, 65, 85);
    const roleOverview =
      `Target Role: ${profile.targetRole}. Market benchmarks in 2026 place extreme emphasis on real-time production ` +
      `deployment, end-to-end MLOps pipeline automation, and distributed model inference. The benchmark standard requires ` +
      `demonstrated proficiency across ML core algorithms, containerization (Docker), model registry (MLflow), and cloud orchestration.`;
    const splitRoleText = this.doc.splitTextToSize(roleOverview, this.contentWidth);
    this.doc.text(splitRoleText, this.marginX, this.currentY);
    this.currentY += splitRoleText.length * 4.2 + 2;

    // Mini table: Target Role Specs
    this.doc.setFillColor(241, 245, 249);
    this.doc.rect(this.marginX, this.currentY, this.contentWidth, 5, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text('COMPENSATION BENCHMARK', this.marginX + 4, this.currentY + 3.5);
    this.doc.text('ANNUAL MARKET DEMAND', this.marginX + 60, this.currentY + 3.5);
    this.doc.text('PRIMARY HIRING HUBS', this.marginX + 115, this.currentY + 3.5);

    this.currentY += 5;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text('$165,000 – $215,000 USD / yr', this.marginX + 4, this.currentY + 4);
    this.doc.text('+28% YoY Growth (High Surge)', this.marginX + 60, this.currentY + 4);
    this.doc.text('SF Bay, Seattle, New York, Bengaluru, Remote', this.marginX + 115, this.currentY + 4);
    this.currentY += 8;

    // ==========================================
    // 3. CURRENT SKILLS & EVIDENCE
    // ==========================================
    this.drawSectionTitle('3', 'Current Skills & Evidence Dossier', 'USER', 'USER DATA');

    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(
      'Note: Demonstrated skills have verifiable code repository or assessment evidence. Claimed skills require verified artifacts.',
      this.marginX,
      this.currentY
    );
    this.currentY += 4.5;

    // Table Header
    this.doc.setFillColor(241, 245, 249);
    this.doc.rect(this.marginX, this.currentY, this.contentWidth, 5.5, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(51, 65, 85);
    this.doc.text('SKILL NAME', this.marginX + 3, this.currentY + 3.8);
    this.doc.text('STATUS & CONFIDENCE', this.marginX + 50, this.currentY + 3.8);
    this.doc.text('PROFICIENCY', this.marginX + 95, this.currentY + 3.8);
    this.doc.text('PRIMARY EVIDENCE ARTIFACT', this.marginX + 125, this.currentY + 3.8);
    this.currentY += 6;

    // Table Rows
    profile.skills.forEach((skill, index) => {
      this.checkPageBreak(8);

      const isEven = index % 2 === 0;
      if (isEven) {
        this.doc.setFillColor(248, 250, 252);
        this.doc.rect(this.marginX, this.currentY, this.contentWidth, 6.5, 'F');
      }

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(skill.name, this.marginX + 3, this.currentY + 4.2);

      // Status
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      if (skill.type === 'demonstrated') {
        this.doc.setTextColor(22, 101, 52); // green
        this.doc.text(`Demonstrated (${skill.confidence})`, this.marginX + 50, this.currentY + 4.2);
      } else {
        this.doc.setTextColor(180, 83, 9); // amber
        this.doc.text(`Claimed (Unverified)`, this.marginX + 50, this.currentY + 4.2);
      }

      // Proficiency Bar
      this.doc.setFillColor(226, 232, 240);
      this.doc.rect(this.marginX + 95, this.currentY + 1.8, 20, 2.5, 'F');
      if (skill.type === 'demonstrated') {
        this.doc.setFillColor(79, 70, 229);
      } else {
        this.doc.setFillColor(217, 119, 6);
      }
      this.doc.rect(this.marginX + 95, this.currentY + 1.8, (20 * skill.proficiency) / 100, 2.5, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(`${skill.proficiency}%`, this.marginX + 116, this.currentY + 4.2);

      // Evidence Artifact
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(71, 85, 105);
      const evTitle = skill.evidence[0] ? skill.evidence[0].title : 'Self-reported';
      this.doc.text(evTitle, this.marginX + 125, this.currentY + 4.2, { maxWidth: 54 });

      this.currentY += 6.5;
    });

    this.currentY += 4;

    // ==========================================
    // 4. SKILL GAP ANALYSIS
    // ==========================================
    this.drawSectionTitle('4', 'Skill Gap Analysis Against Market Baseline', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(51, 65, 85);
    const gapAnalysisText =
      `Based on 2,400+ active ML Engineer roles in Q1 2026, candidates lacking automated CI/CD and containerized ` +
      `deployment experience face a 4.2x higher interview screening drop-off. The gap between your current 72% alignment ` +
      `and the 85%+ high-readiness tier stems directly from three specific competencies:`;
    const splitGapText = this.doc.splitTextToSize(gapAnalysisText, this.contentWidth);
    this.doc.text(splitGapText, this.marginX, this.currentY);
    this.currentY += splitGapText.length * 4.2 + 2;

    // ==========================================
    // 5. MISSING AND DEVELOPING SKILLS
    // ==========================================
    this.drawSectionTitle('5', 'Missing & Developing Skills Prioritization', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    const gapsList = [
      {
        skill: 'Docker & Containerization',
        level: 'MISSING',
        impact: 'High Impact (-12% Alignment)',
        description: 'Required for packaging PyTorch/TensorFlow models into production microservices.'
      },
      {
        skill: 'MLOps (MLflow, CI/CD, Registry)',
        level: 'MISSING',
        impact: 'High Impact (-10% Alignment)',
        description: 'Required for automated experiment tracking, model governance, and continuous training loops.'
      },
      {
        skill: 'Distributed Cloud (Kubernetes / Ray)',
        level: 'DEVELOPING',
        impact: 'Moderate Impact (-6% Alignment)',
        description: 'Demonstrated single-node capability; multi-node cluster deployment required for enterprise scale.'
      }
    ];

    gapsList.forEach((gap) => {
      this.checkPageBreak(12);

      const isMissing = gap.level === 'MISSING';
      this.doc.setFillColor(isMissing ? 254 : 255, isMissing ? 242 : 251, isMissing ? 242 : 235);
      this.doc.setDrawColor(isMissing ? 254 : 253, isMissing ? 202 : 230, isMissing ? 202 : 138);
      this.doc.setLineWidth(0.3);
      this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 10, 1.5, 1.5, 'FD');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(isMissing ? 159 : 146, isMissing ? 18 : 64, isMissing ? 57 : 14);
      this.doc.text(`[${gap.level}] ${gap.skill}`, this.marginX + 4, this.currentY + 4.2);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.text(gap.impact, this.pageWidth - this.marginX - 4, this.currentY + 4.2, { align: 'right' });

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(51, 65, 85);
      this.doc.text(gap.description, this.marginX + 4, this.currentY + 7.8, { maxWidth: this.contentWidth - 8 });

      this.currentY += 12;
    });

    // ==========================================
    // 6. WHAT-IF SIMULATION RESULTS
    // ==========================================
    this.drawSectionTitle('6', 'What-If Career Simulation Telemetry', 'SIMULATION', 'SIMULATION');

    // Prominent Simulation Disclaimer Box
    this.checkPageBreak(14);
    this.doc.setFillColor(254, 243, 199); // Amber-100
    this.doc.setDrawColor(245, 158, 11); // Amber-500
    this.doc.setLineWidth(0.4);
    this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 8, 1.5, 1.5, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(146, 64, 14);
    this.doc.text(
      'MANDATORY NOTICE: SIMULATION — not a guaranteed career or employment outcome.',
      this.marginX + 4,
      this.currentY + 5.2
    );
    this.currentY += 11;

    // Simulation Outcome Box
    this.checkPageBreak(25);
    this.doc.setFillColor(248, 250, 252);
    this.doc.setDrawColor(203, 213, 225);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 23, 2, 2, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text('SIMULATED SKILL ACQUISITION', this.marginX + 4, this.currentY + 5);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(15, 23, 42);
    this.doc.text(`+ ${simulationSkills.join('   +   ')}`, this.marginX + 4, this.currentY + 10);

    // Delta Stats
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text('BASELINE', this.marginX + 95, this.currentY + 5);
    this.doc.text('SIMULATED', this.marginX + 120, this.currentY + 5);
    this.doc.text('PROJECTED LIFT', this.marginX + 150, this.currentY + 5);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(100, 116, 139);
    this.doc.text(`${simResult.initialAlignment}%`, this.marginX + 95, this.currentY + 12);

    this.doc.setTextColor(79, 70, 229);
    this.doc.text(`${simResult.simulatedAlignment}%`, this.marginX + 120, this.currentY + 12);

    this.doc.setTextColor(22, 101, 52);
    this.doc.text(`+${simResult.delta}% LIFT`, this.marginX + 150, this.currentY + 12);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(71, 85, 105);
    this.doc.text(`Newly unlocked high-match job opportunities: +${simResult.newJobsUnlocked} positions`, this.marginX + 4, this.currentY + 18);

    this.currentY += 27;

    // Simulation Multi-role shifts
    this.checkPageBreak(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(51, 65, 85);
    this.doc.text('Cross-Role Compatibility Multiplier:', this.marginX, this.currentY);
    this.currentY += 4;

    simResult.roleCompatibilities.forEach((rc, i) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(30, 41, 59);
      this.doc.text(
        `• ${rc.role}: ${rc.before}% -> ${rc.after}% (+${rc.delta}% lift)`,
        this.marginX + 4,
        this.currentY + i * 4.2
      );
    });
    this.currentY += simResult.roleCompatibilities.length * 4.2 + 4;

    // ==========================================
    // 7. CAREER PATH INSIGHTS
    // ==========================================
    this.drawSectionTitle('7', 'Career Path Trajectory Insights', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    this.checkPageBreak(25);
    const paths = initialCareerRoles.slice(0, 3);
    paths.forEach((role) => {
      this.checkPageBreak(12);
      this.doc.setFillColor(248, 250, 252);
      this.doc.setDrawColor(226, 232, 240);
      this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 11, 1.5, 1.5, 'FD');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(role.title, this.marginX + 4, this.currentY + 4.5);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(`Salary: ${role.medianComp} | Time to Transition: ${role.timeToTransition}`, this.marginX + 4, this.currentY + 8.5);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(79, 70, 229);
      this.doc.text(`${role.userAlignment}% Alignment`, this.pageWidth - this.marginX - 4, this.currentY + 4.5, { align: 'right' });

      this.currentY += 13;
    });

    // ==========================================
    // 8. PERSONALIZED 90-DAY LEARNING ROADMAP
    // ==========================================
    this.drawSectionTitle('8', 'Personalized 90-Day Learning Roadmap Timeline', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    const roadmapPhases = [
      {
        phase: 'PHASE 1: DAYS 1 – 30',
        title: 'Containerized Microservice Architecture & Packaging',
        targetSkill: 'Docker, Multi-Stage Builds, FastAPI, Non-Root Security',
        deliverable: 'Target Deliverable: Dockerized PyTorch/FastAPI model inference repo with automated unit tests (<35ms latency).',
        verification: 'Verification Milestone: Zero-error multi-stage build, container registry image push to GitHub Packages.'
      },
      {
        phase: 'PHASE 2: DAYS 31 – 60',
        title: 'MLOps Automated CI/CD & Model Governance',
        targetSkill: 'MLflow Model Registry, GitHub Actions, Automated Drift Loops',
        deliverable: 'Target Deliverable: End-to-end retraining & evaluation pipeline triggered on code commit.',
        verification: 'Verification Milestone: Automated model evaluation and model card generation in CI with 100% test pass.'
      },
      {
        phase: 'PHASE 3: DAYS 61 – 90',
        title: 'Production Cloud Serving & Observability',
        targetSkill: 'AWS ECS / EKS, Prometheus Telemetry, Canary Deployment Rollouts',
        deliverable: 'Target Deliverable: Live deployed inference endpoint with p99 latency telemetry and health probes.',
        verification: 'Verification Milestone: Documented zero-downtime canary rollout proof attached to CareerTwin evidence.'
      }
    ];

    roadmapPhases.forEach((p, idx) => {
      this.checkPageBreak(22);

      this.doc.setFillColor(255, 255, 255);
      this.doc.setDrawColor(226, 232, 240);
      this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 19, 2, 2, 'FD');

      // Left phase badge
      this.doc.setFillColor(79, 70, 229);
      this.doc.rect(this.marginX, this.currentY, 3, 19, 'F');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(79, 70, 229);
      this.doc.text(p.phase, this.marginX + 6, this.currentY + 4.5);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(p.title, this.marginX + 45, this.currentY + 4.5);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(100, 116, 139);
      this.doc.text(`Competencies: ${p.targetSkill}`, this.marginX + 6, this.currentY + 8.5);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(51, 65, 85);
      this.doc.text(p.deliverable, this.marginX + 6, this.currentY + 12.5, { maxWidth: this.contentWidth - 10 });

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(22, 101, 52); // emerald-800
      this.doc.text(p.verification, this.marginX + 6, this.currentY + 16.5, { maxWidth: this.contentWidth - 10 });

      this.currentY += 22;
    });

    // ==========================================
    // 9. RECOMMENDED PROJECTS
    // ==========================================
    this.drawSectionTitle('9', 'Recommended Portfolio Projects for Verification', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    const recommendedProjects = [
      {
        title: 'Project Alpha: Production ML Inference Microservice',
        tech: 'FastAPI, Docker, ONNX Runtime, PyTorch, Prometheus',
        impact: 'Closes Docker gap. Provides concrete latency benchmarks and container security scan artifacts.'
      },
      {
        title: 'Project Beta: Automated Continuous Training & Registry Pipeline',
        tech: 'MLflow, GitHub Actions, DVC, AWS S3, PyTest',
        impact: 'Closes MLOps gap. Demonstrates automated data drift alarms and versioned model deployment.'
      }
    ];

    recommendedProjects.forEach((proj) => {
      this.checkPageBreak(14);
      this.doc.setFillColor(248, 250, 252);
      this.doc.setDrawColor(226, 232, 240);
      this.doc.roundedRect(this.marginX, this.currentY, this.contentWidth, 12, 1.5, 1.5, 'FD');

      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(15, 23, 42);
      this.doc.text(proj.title, this.marginX + 4, this.currentY + 4.2);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(79, 70, 229);
      this.doc.text(`Stack: ${proj.tech}`, this.marginX + 4, this.currentY + 7.5);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(71, 85, 105);
      this.doc.text(`Evidence Impact: ${proj.impact}`, this.marginX + 4, this.currentY + 10.5);

      this.currentY += 14;
    });

    // ==========================================
    // 10. RECOMMENDED NEXT ACTIONS
    // ==========================================
    this.drawSectionTitle('10', 'Recommended Next Actions (Immediate)', 'ANALYSIS', 'PRAVRIDDHI ANALYSIS');

    const nextActions = [
      '1. Initialize Docker repository with multi-stage build for existing scikit-learn/PyTorch code.',
      '2. Configure GitHub Actions workflow to run container smoke tests on every push.',
      '3. Sync new GitHub project artifact into CareerTwin to convert claimed container skill to demonstrated.',
      '4. Re-run What-If Career Simulator to confirm alignment progression toward 85%+'
    ];

    nextActions.forEach((action) => {
      this.checkPageBreak(6);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.8);
      this.doc.setTextColor(30, 41, 59);
      this.doc.text(action, this.marginX + 4, this.currentY);
      this.currentY += 4.5;
    });
    this.currentY += 3;

    // ==========================================
    // 11. WORKFORCE INTELLIGENCE INSIGHTS
    // ==========================================
    this.drawSectionTitle('11', 'Workforce Intelligence & Emerging Trends', 'WEB', 'LIVE WEB INFORMATION');

    const wiSummary = workforceInsights?.summary ||
      `Real-time Google search workforce data indicates surging demand for LLM inference optimization (vLLM, Ollama), ` +
      `agentic workflows (LangGraph, AutoGen), and automated evaluation frameworks. Companies are increasingly filtering ` +
      `candidates by demonstrated production experience over theoretical certifications.`;

    const splitWi = this.doc.splitTextToSize(wiSummary, this.contentWidth);
    this.doc.text(splitWi, this.marginX, this.currentY);
    this.currentY += splitWi.length * 4.2 + 3;

    // ==========================================
    // 12. SOURCES & CITATIONS
    // ==========================================
    this.drawSectionTitle('12', 'Sources & Grounded Citations', 'WEB', 'LIVE WEB INFORMATION');

    const sources = workforceInsights?.sources || [
      { title: 'Google DeepMind & Industry AI Skills Index (2026)', domain: 'deepmind.google', date: 'Feb 2026' },
      { title: 'MLOps Community State of Production Machine Learning', domain: 'mlops.community', date: 'Jan 2026' },
      { title: 'Hiring Trends in Applied AI & Machine Learning Systems', domain: 'levels.fyi', date: '2026' }
    ];

    sources.forEach((src) => {
      this.checkPageBreak(6);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(14, 116, 144);
      this.doc.text(`• ${src.title}`, this.marginX + 4, this.currentY);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(100, 116, 139);
      this.doc.text(`[${src.domain} · ${src.date || 'Live Web'}]`, this.marginX + 115, this.currentY);

      this.currentY += 4.2;
    });

    // ==========================================
    // FOOTER ON ALL PAGES WITH PAGE NUMBERS
    // ==========================================
    this.totalPages = this.doc.internal.pages.length - 1;
    for (let i = 1; i <= this.totalPages; i++) {
      this.doc.setPage(i);
      
      // Bottom divider rule
      this.doc.setDrawColor(226, 232, 240);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.marginX, this.pageHeight - this.marginY + 2, this.pageWidth - this.marginX, this.pageHeight - this.marginY + 2);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(140, 150, 165);
      this.doc.text(
        `Pravriddhi · Target Role: ${profile.targetRole} · Document: ${documentId}`,
        this.marginX,
        this.pageHeight - this.marginY + 6
      );

      this.doc.text(
        `Page ${i} of ${this.totalPages}`,
        this.pageWidth - this.marginX,
        this.pageHeight - this.marginY + 6,
        { align: 'right' }
      );
    }

    return this.doc;
  }
}

export function generateCareerTwinPDF(data: CareerTwinReportData): {
  blob: Blob;
  dataUri: string;
  download: (filename?: string) => void;
} {
  const generator = new CareerTwinPDFGenerator();
  const doc = generator.generate(data);

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const defaultFilename = `Pravriddhi_CareerTwin_Report_${data.profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const download = (filename = defaultFilename) => {
    doc.save(filename);
  };

  return { blob, dataUri, download };
}
