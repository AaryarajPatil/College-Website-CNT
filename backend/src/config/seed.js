import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Project from '../models/Project.js';
import ResearchPaper from '../models/ResearchPaper.js';
import Achievement from '../models/Achievement.js';
import Deadline from '../models/Deadline.js';
import Activity from '../models/Activity.js';

export const seedDatabase = async () => {
  try {
    const existingUser = await User.findOne({ email: 'aryan.sharma@vierp.edu' });
    if (existingUser) {
      console.log('[Seed] Database already seeded with demo user.');
      return existingUser;
    }

    console.log('[Seed] Seeding realistic student dataset for Premium Vierp...');

    // 1. Create Student User
    const student = await User.create({
      name: 'Aryan Sharma',
      email: 'aryan.sharma@vierp.edu',
      password: 'password123', // Will be hashed via pre-save hook
      rollNumber: '21BCE10482',
      branch: 'Computer Science & Engineering',
      specialization: 'Artificial Intelligence & Machine Learning',
      year: 'Final Year (4th Year)',
      semester: 7,
      cgpa: 9.34,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Passionate AI/ML researcher & systems architect crafting efficient deep learning models, distributed inference engines, and scalable cloud infrastructure.',
      socialLinks: {
        github: 'https://github.com/aryan-sharma-ai',
        linkedin: 'https://linkedin.com/in/aryan-sharma-ml',
        scholar: 'https://scholar.google.com/citations?user=aryan-sharma',
        portfolio: 'https://aryansharma.dev',
      },
    });

    const userId = student._id;

    // 2. Create Subjects
    const subjectsData = [
      {
        userId,
        name: 'Machine Learning',
        code: 'CS701',
        credits: 4,
        professor: 'Dr. Rajesh Iyer',
        attendanceRate: 94,
        semester: 7,
        colorTag: '#D4AF37', // Gold
        description: 'Supervised, unsupervised, probabilistic graphical models, and neural architectures.',
        syllabusTopics: [
          { topic: 'Statistical Learning Theory & PAC', isCompleted: true },
          { topic: 'Deep Neural Networks & Backpropagation', isCompleted: true },
          { topic: 'Convolutional & Recurrent Architectures', isCompleted: true },
          { topic: 'Transformer Attention & Self-Supervision', isCompleted: false },
        ],
      },
      {
        userId,
        name: 'Cloud Computing',
        code: 'CS702',
        credits: 4,
        professor: 'Prof. Elena Rostova',
        attendanceRate: 89,
        semester: 7,
        colorTag: '#38BDF8', // Cyan
        description: 'Virtualization, serverless architectures, Kubernetes container orchestration, and multi-cloud resilience.',
        syllabusTopics: [
          { topic: 'Hypervisors & KVM Virtualization', isCompleted: true },
          { topic: 'Docker Internals & OCI Specs', isCompleted: true },
          { topic: 'Kubernetes Cluster Architecture', isCompleted: true },
          { topic: 'Cloud Native Microservices & Service Mesh', isCompleted: false },
        ],
      },
      {
        userId,
        name: 'Computer Networks',
        code: 'CS703',
        credits: 3,
        professor: 'Dr. Michael Chang',
        attendanceRate: 92,
        semester: 7,
        colorTag: '#A855F7', // Purple
        description: 'Protocols, TCP/IP stack optimization, SDN, and zero-trust network architectures.',
        syllabusTopics: [
          { topic: 'BGP Routing & Autonomous Systems', isCompleted: true },
          { topic: 'QUIC & HTTP/3 Transport Protocols', isCompleted: true },
          { topic: 'Software-Defined Networking (OpenFlow)', isCompleted: true },
          { topic: 'Network Security & TLS 1.3 Handshake', isCompleted: false },
        ],
      },
      {
        userId,
        name: 'Artificial Intelligence',
        code: 'CS704',
        credits: 4,
        professor: 'Dr. Sarah Al-Mansoor',
        attendanceRate: 96,
        semester: 7,
        colorTag: '#F59E0B', // Amber
        description: 'Heuristic search algorithms, knowledge representation, Bayesian reasoning, and reinforcement learning.',
        syllabusTopics: [
          { topic: 'A* & Adversarial Game Search', isCompleted: true },
          { topic: 'Markov Decision Processes & Bellman Equations', isCompleted: true },
          { topic: 'Q-Learning & Policy Gradients', isCompleted: true },
          { topic: 'Knowledge Graphs & First-Order Logic', isCompleted: false },
        ],
      },
      {
        userId,
        name: 'Database Management Systems',
        code: 'CS705',
        credits: 4,
        professor: 'Prof. David Miller',
        attendanceRate: 88,
        semester: 7,
        colorTag: '#10B981', // Emerald
        description: 'Relational query engines, indexing (B+ trees, LSM trees), ACID concurrency control, and distributed storage.',
        syllabusTopics: [
          { topic: 'Query Optimization & Explain Plans', isCompleted: true },
          { topic: 'Multi-Version Concurrency Control (MVCC)', isCompleted: true },
          { topic: 'Distributed Consensus (Raft/Paxos)', isCompleted: true },
          { topic: 'NoSQL & Vector Embeddings Indexing (HNSW)', isCompleted: false },
        ],
      },
      {
        userId,
        name: 'Distributed Deep Learning Systems',
        code: 'CS706',
        credits: 3,
        professor: 'Dr. Rajesh Iyer',
        attendanceRate: 91,
        semester: 7,
        colorTag: '#EC4899', // Pink
        description: 'Pipeline parallelism, tensor parallelism (Megatron), ZeRO memory optimization, and NCCL communication.',
        syllabusTopics: [
          { topic: 'Data Parallelism & Ring AllReduce', isCompleted: true },
          { topic: 'DeepSpeed ZeRO Stages 1-3', isCompleted: true },
          { topic: 'Pipeline Parallelism (PipeDream)', isCompleted: true },
          { topic: 'Quantization & FlashAttention-2', isCompleted: false },
        ],
      },
    ];

    const subjects = await Subject.insertMany(subjectsData);
    const subMap = {};
    subjects.forEach((s) => {
      subMap[s.name] = s._id;
    });

    // 3. Create Projects
    const projectsData = [
      {
        userId,
        title: 'NeuroVision: Real-Time Multimodal Diagnostic Assistant',
        description:
          'Deep learning system that ingests multimodal medical scans (X-ray, MRI, CT) alongside patient electronic health records to generate diagnostic interpretations with visual saliency heatmaps and confidence calibration.',
        subjectId: subMap['Machine Learning'],
        subjectName: 'Machine Learning',
        technologies: ['PyTorch', 'FastAPI', 'React', 'YOLOv8', 'Docker', 'CUDA'],
        githubUrl: 'https://github.com/aryan-sharma-ai/neuro-vision-diagnostics',
        liveUrl: 'https://neurovision.vierp.live',
        teamMembers: [
          { name: 'Aryan Sharma', role: 'Lead ML Engineer & Architect' },
          { name: 'Sneha Patel', role: 'Frontend & UI Specialist' },
          { name: 'Rohan Verma', role: 'Cloud & MLOps Engineer' },
        ],
        duration: '4 Months',
        documentation:
          'Architecture encompasses Swin Transformer backbone with multi-head cross-attention. Deployed via TensorRT containers on AWS g5.2xlarge instances.',
        status: 'Completed',
        progress: 100,
        featured: true,
      },
      {
        userId,
        title: 'AuraCloud: Serverless Edge Inference Engine',
        description:
          'High-performance WebAssembly runtime and lightweight container orchestrator designed to serve ONNX model inferences at ultra-low latency (<4ms cold start) across distributed edge nodes.',
        subjectId: subMap['Cloud Computing'],
        subjectName: 'Cloud Computing',
        technologies: ['Go', 'Rust', 'WebAssembly', 'Kubernetes', 'AWS Lambda', 'gRPC'],
        githubUrl: 'https://github.com/aryan-sharma-ai/auracloud-edge',
        liveUrl: 'https://auracloud.dev',
        teamMembers: [
          { name: 'Aryan Sharma', role: 'Core Engine Architect' },
          { name: 'Aditya Sen', role: 'Systems & Benchmark Engineer' },
        ],
        duration: '3 Months',
        documentation:
          'Built with Wasmtime runtime bindings and custom shared-memory IPC buffer, reducing model memory overhead by 68%.',
        status: 'In Progress',
        progress: 80,
        featured: true,
      },
      {
        userId,
        title: 'GraphRAG: Knowledge Graph-Augmented LLM Search Engine',
        description:
          'Hybrid retrieval system combining dense vector search (HNSW) and structured entity graphs to eliminate hallucination in domain-specific academic literature retrieval.',
        subjectId: subMap['Artificial Intelligence'],
        subjectName: 'Artificial Intelligence',
        technologies: ['Python', 'Neo4j', 'LangChain', 'OpenAI', 'React', 'Tailwind'],
        githubUrl: 'https://github.com/aryan-sharma-ai/graph-rag-engine',
        liveUrl: 'https://graphrag.vierp.live',
        teamMembers: [
          { name: 'Aryan Sharma', role: 'Sole Developer & Researcher' },
        ],
        duration: '2 Months',
        documentation:
          'Extracts triple entities (Subject-Predicate-Object) using fine-tuned Llama-3-8B and constructs real-time Neo4j graphs.',
        status: 'In Progress',
        progress: 70,
        featured: false,
      },
      {
        userId,
        title: 'SecureNet: Zero-Trust Microsegmentation for Cloud VNFs',
        description:
          'Kernel-level programmable network packet filtering framework using eBPF and XDP to enforce dynamic least-privilege security policies on virtualized multi-tenant cloud networks.',
        subjectId: subMap['Computer Networks'],
        subjectName: 'Computer Networks',
        technologies: ['eBPF', 'Rust', 'C++', 'Linux Kernel', 'Grafana'],
        githubUrl: 'https://github.com/aryan-sharma-ai/securenet-ebpf',
        liveUrl: '',
        teamMembers: [
          { name: 'Aryan Sharma', role: 'Kernel & Systems Programmer' },
          { name: 'Kavita Joshi', role: 'Policy Engine Developer' },
        ],
        duration: '3 Months',
        documentation:
          'Evaluated over 10Gbps synthetic network traffic benchmarks with zero observed packet drops and sub-microsecond filtering jitter.',
        status: 'Completed',
        progress: 100,
        featured: false,
      },
      {
        userId,
        title: 'Quantum-Resistant Academic Credential Ledger',
        description:
          'Post-quantum cryptographic state machine verifying tamper-proof student degrees and grade sheets using Kyber-1024 and Dilithium lattice signature schemes.',
        subjectId: subMap['Database Management Systems'],
        subjectName: 'Database Management Systems',
        technologies: ['Rust', 'Post-Quantum Crypto', 'SQLite', 'React'],
        githubUrl: 'https://github.com/aryan-sharma-ai/pqc-credential-ledger',
        liveUrl: '',
        teamMembers: [
          { name: 'Aryan Sharma', role: 'Cryptographic Protocol Designer' },
        ],
        duration: '1 Month',
        documentation:
          'Exploratory research implementing NIST PQC Level 5 standardization algorithms.',
        status: 'Idea',
        progress: 30,
        featured: false,
      },
    ];

    await Project.insertMany(projectsData);

    // 4. Create Research Papers & Publications
    const researchData = [
      {
        userId,
        title: 'Low-Latency Transformer Pruning for Edge Neuromorphic Accelerators',
        abstract:
          'In this work, we propose Structured Latency-Aware Head Pruning (SLA-HP), an algorithm that co-optimizes attention head importance with neuromorphic spike-timing properties. Across Vision Transformer benchmarks, SLA-HP achieves 3.8x inference speedup with <0.4% top-1 accuracy degradation.',
        conferenceJournal: 'IEEE Transactions on Neural Networks and Learning Systems (TNNLS)',
        authors: ['Aryan Sharma', 'Dr. Rajesh Iyer', 'Prof. Elena Rostova'],
        submissionDate: new Date('2025-02-15'),
        doi: '10.1109/TNNLS.2025.3341829',
        paperUrl: 'https://arxiv.org/abs/2502.10482',
        status: 'Published',
        keywords: ['Transformer Pruning', 'Edge Computing', 'Neuromorphic Hardware', 'Model Compression'],
        impactFactor: '10.4',
        citations: 14,
      },
      {
        userId,
        title: 'Federated Graph Learning with Differential Privacy under Heterogeneous Non-IID Topologies',
        abstract:
          'We present DP-FedGraph, a privacy-preserving federated graph neural network framework addressing severe structural heterogeneity and topology skew. We establish theoretical guarantees on privacy budget epsilon while outperforming baselines by 12.6% on node classification.',
        conferenceJournal: 'NeurIPS 2025 Workshop on Federated Learning',
        authors: ['Aryan Sharma', 'Dr. Rajesh Iyer'],
        submissionDate: new Date('2025-06-20'),
        doi: '10.48550/arXiv.2506.09124',
        paperUrl: 'https://arxiv.org/abs/2506.09124',
        status: 'Accepted',
        keywords: ['Federated Learning', 'Graph Neural Networks', 'Differential Privacy'],
        impactFactor: 'Tier-1 A*',
        citations: 5,
      },
      {
        userId,
        title: 'Optimizing KV-Cache Allocation in Distributed LLM Serving using Dynamic Speculative Decoding',
        abstract:
          'Serving long-context 70B+ parameter LLMs faces severe GPU memory bandwidth bottlenecks. We introduce DynKV, a dynamic hierarchical memory allocator that swaps inactive token key-values to host RAM based on speculative attention scoring.',
        conferenceJournal: 'ACM SIGCOMM 2026',
        authors: ['Aryan Sharma', 'Prof. Elena Rostova', 'Dr. Michael Chang'],
        submissionDate: new Date('2025-11-10'),
        doi: '',
        paperUrl: 'https://arxiv.org/abs/2511.00293',
        status: 'Under Review',
        conferenceDeadline: new Date('2026-04-15'),
        keywords: ['LLM Serving', 'KV Cache', 'Distributed Systems', 'GPU Memory Management'],
        impactFactor: 'Tier-1 Conference',
        citations: 0,
      },
      {
        userId,
        title: 'Self-Supervised Contrastive Representation on Multimodal Medical Scans',
        abstract:
          'Investigating contrastive patch alignment across MRI volumes and histological slice stained images for zero-shot tumor classification.',
        conferenceJournal: 'CVPR 2026 (IEEE/CVF Conference on Computer Vision)',
        authors: ['Aryan Sharma', 'Dr. Sarah Al-Mansoor'],
        submissionDate: new Date('2026-01-05'),
        doi: '',
        paperUrl: '',
        status: 'Draft',
        conferenceDeadline: new Date('2026-03-25'),
        keywords: ['Self-Supervised Learning', 'Medical Imaging', 'Contrastive Learning'],
        impactFactor: 'Top Vision Conference',
        citations: 0,
      },
    ];

    await ResearchPaper.insertMany(researchData);

    // 5. Create Achievements & Certifications
    const achievementsData = [
      {
        userId,
        title: '1st Place Winner - Global AI Hackathon 2025',
        category: 'Hackathons',
        organization: 'Google Cloud & NVIDIA AI',
        issueDate: new Date('2025-08-18'),
        description:
          'Built NeuroVision in 48 hours, selected as 1st prize winner out of 850+ international university teams. Awarded $10,000 USD grant and GPU cloud compute credits.',
        credentialUrl: 'https://credentials.google.com/awards/global-ai-hack-2025-first-place',
        badgeIcon: 'Trophy',
        skills: ['PyTorch', 'Real-time AI', 'Team Leadership', 'FastAPI'],
      },
      {
        userId,
        title: 'AWS Certified Solutions Architect – Professional',
        category: 'Certifications',
        organization: 'Amazon Web Services (AWS)',
        issueDate: new Date('2025-04-10'),
        description:
          'Demonstrated deep technical expertise in designing highly scalable, cost-optimized, fault-tolerant, and secure distributed cloud architectures on AWS.',
        credentialUrl: 'https://aws.amazon.com/verification/AWS-PSA-9948291',
        badgeIcon: 'Award',
        skills: ['AWS Lambda', 'Amazon EKS', 'VPC Architecture', 'Cloud Security'],
      },
      {
        userId,
        title: 'NVIDIA DLI Certified: Generative AI Specialist',
        category: 'Certifications',
        organization: 'NVIDIA Deep Learning Institute',
        issueDate: new Date('2025-01-22'),
        description:
          'Mastered LLM fine-tuning, Low-Rank Adaptation (LoRA), FlashAttention, and TensorRT-LLM deployment strategies.',
        credentialUrl: 'https://learn.nvidia.com/certificates/NV-DLI-GAI-88219',
        badgeIcon: 'Sparkles',
        skills: ['LLMs', 'LoRA', 'TensorRT', 'CUDA'],
      },
      {
        userId,
        title: 'Machine Learning Research Intern',
        category: 'Internships',
        organization: 'Microsoft Research & AI Lab',
        issueDate: new Date('2025-05-01'),
        description:
          '6-month intensive research internship contributing to transformer inference acceleration and federated learning protocols.',
        credentialUrl: 'https://careers.microsoft.com/research/alumni/aryan-sharma',
        badgeIcon: 'Briefcase',
        skills: ['Deep Learning', 'PyTorch', 'Distributed Training', 'Research Writing'],
      },
      {
        userId,
        title: "Dean's Academic Excellence Gold Medalist (2024-2025)",
        category: 'Awards',
        organization: 'University Academic Senate',
        issueDate: new Date('2025-07-30'),
        description:
          'Ranked 1st in the Department of Computer Science & Engineering with a cumulative GPA of 9.34 across 6 semesters.',
        credentialUrl: 'https://university.edu/honors/deans-list-2025',
        badgeIcon: 'Award',
        skills: ['Academic Rigor', 'Computer Science Core', 'Mathematics'],
      },
      {
        userId,
        title: 'Smart India Hackathon Finalist',
        category: 'Competitions',
        organization: 'Ministry of Education & AICTE',
        issueDate: new Date('2024-12-12'),
        description:
          'Developed an automated crop disease detection drone system for national agricultural security.',
        credentialUrl: 'https://sih.gov.in/finalists/2024/team-neurotech',
        badgeIcon: 'Trophy',
        skills: ['Edge AI', 'Computer Vision', 'IoT'],
      },
    ];

    await Achievement.insertMany(achievementsData);

    // 6. Create Upcoming Deadlines
    const deadlinesData = [
      {
        userId,
        title: 'CVPR 2026 Camera-Ready & Supplementary Upload',
        type: 'Conference',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        subjectId: subMap['Machine Learning'],
        subjectName: 'Machine Learning',
        priority: 'Critical',
        status: 'Pending',
        description: 'Complete final revisions for ablation experiments and upload supplementary zip.',
      },
      {
        userId,
        title: 'Distributed Systems Final Capstone Milestone 3',
        type: 'Project Milestone',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        subjectId: subMap['Distributed Deep Learning Systems'],
        subjectName: 'Distributed Deep Learning Systems',
        priority: 'High',
        status: 'Pending',
        description: 'Submit DeepSpeed ZeRO-3 cluster performance benchmark report and GitHub repo link.',
      },
      {
        userId,
        title: 'Cloud Computing Lab Assignment 4: Helm Charts',
        type: 'Assignment',
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // in 8 days
        subjectId: subMap['Cloud Computing'],
        subjectName: 'Cloud Computing',
        priority: 'Medium',
        status: 'Pending',
        description: 'Deploy stateless microservice using Helm chart with autoscaling HPA configuration.',
      },
      {
        userId,
        title: 'End-Semester Theory Examination: Machine Learning',
        type: 'Exam',
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // in 18 days
        subjectId: subMap['Machine Learning'],
        subjectName: 'Machine Learning',
        priority: 'High',
        status: 'Pending',
        description: 'Comprehensive 3-hour exam covering modules 1 to 5.',
      },
      {
        userId,
        title: 'ACM SIGCOMM 2026 Author Response Rebuttal',
        type: 'Conference',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // in 25 days
        subjectId: subMap['Computer Networks'],
        subjectName: 'Computer Networks',
        priority: 'Critical',
        status: 'Pending',
        description: 'Address reviewer queries on KV-cache memory latency bounds.',
      },
    ];

    await Deadline.insertMany(deadlinesData);

    // 7. Create Activity Timeline
    const activitiesData = [
      {
        userId,
        title: 'Research Paper Accepted at NeurIPS Workshop',
        type: 'paper_accepted',
        description: 'DP-FedGraph paper formally accepted for presentation at NeurIPS 2025 Federated Learning track.',
        category: 'Research',
        icon: 'Award',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: '1st Prize Secured at Global AI Hackathon 2025',
        type: 'achievement_earned',
        description: 'Won 1st place in the Grand Finals with NeuroVision Diagnostic Assistant.',
        category: 'Achievements',
        icon: 'Trophy',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: 'Completed Project: NeuroVision Diagnostic Assistant',
        type: 'project_completed',
        description: 'Reached 100% production milestone with TensorRT edge deployment containers.',
        category: 'Projects',
        icon: 'CheckCircle',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: 'Manuscript Submitted: ACM SIGCOMM 2026',
        type: 'paper_submitted',
        description: 'Submitted 14-page manuscript on DynKV distributed inference allocator.',
        category: 'Research',
        icon: 'BookMarked',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: 'Enrolled in 7th Semester Core Courses',
        type: 'subject_enrolled',
        description: 'Successfully registered for 6 subjects totaling 22 academic credits.',
        category: 'Academic',
        icon: 'BookOpen',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        title: 'AWS Solutions Architect Professional Earned',
        type: 'achievement_earned',
        description: 'Successfully cleared AWS PSA exam with 912/1000 score.',
        category: 'Achievements',
        icon: 'Award',
        timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
    ];

    await Activity.insertMany(activitiesData);

    console.log('[Seed] Database successfully seeded with 6 subjects, 5 projects, 4 research papers, 6 achievements, 5 deadlines, and activity feed!');
    return student;
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
  }
};
