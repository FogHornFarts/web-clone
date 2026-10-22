// Static mock data for the rebuilt VTOP dashboard. Edit freely: nothing here talks to the real VTOP.

const STUDENT = {
    regNo: "24BCEXXXX",
    role: "STUDENT",
    name: ""
};

// Top horizontal menu groups, in VTOP's order. Only groups with `columns` are rebuilt.
const MENU_GROUPS = [
    { id: "MG0001", label: "Academics", icon: "bi-mortarboard-fill" },
    { id: "MG0002", label: "Examinations", icon: "bi-pencil-square" },
    { id: "MG0010", label: "Admissions", icon: "bi-ticket-detailed-fill" },
    { id: "MG0003", label: "Finance", icon: "bi-cash-coin" },
    { id: "MG0004", label: "Events", icon: "bi-shield-shaded" },
    { id: "MG0015", label: "SAP/IR", icon: "bi-airplane-engines-fill" },
    { id: "MG0005", label: "Services", icon: "bi-wifi" },
    {
        id: "MG0009",
        label: "Hostels",
        icon: "bi-house-add-fill",
        // Each column is a list of entries; a `heading` entry starts a new section.
        columns: [
            [
                { heading: "General", icon: "fa fa-book" },
                { label: "Online Booking - Summer", url: "hostels/online/room/allotment/open" },
                { label: "Leave Request", url: "hostels/student/leave/1" },
                { label: "Hostel Vacating", url: "hostels/vacating" },
                { label: "Mess Change", url: "hostels/onlineMessChange" },
                { label: "Summer Room-Details", url: "hostels/summerRoomDetails" },
                { label: "Mess Complaint", url: "hostels/messComplaintPage" },
                { label: "Hostel Bonafide", url: "hostels/hostelBonafide" },
                { heading: "Counselling 2026", icon: "fa fa-user" },
                { label: "Know Your Rank", url: "hostels/counsellingSlotTimings" }
            ],
            [
                { label: "Provisional Allotment Letter", url: "hostels/counselling/provisional/order/1" },
                { label: "Mess Selection 2026-2027", url: "hostels/counselling/mess/registration" }
            ]
        ]
    },
    { id: "MG0008", label: "Feedback", icon: "bi-person-raised-hand" }
];

// Hostels > Mess Selection 2026-2027 (hostels/counselling/mess/registration)
const MESS_SELECTION = {
    title: "Counselling Mess Selection [ 2026 - 27 ]",
    applicationNumber: "20XXXXXXXX",
    roomNumber: "522",
    roomDetails: "4 - Bed - AC",
    blockDetails: "MUTHAMIZH ARIGNAR KALAIGNAR M.KARUNANIDHI BLOCK - [ MHR ] - [ APARTMENT AC ]",
    optedMess: "NON-VEG MESS - RRC-NV-SHREE RAJA RAJESHWARI CATERING PVT LTD [L BLOCK]",
    confirmed: true
};

const QUICK_LINKS = [
    { label: "Marks", url: "examinations/StudentMarkView" }
];

const DASHBOARD = {
    semester: "FALLSEM2026-27",

    courses: [
        { code: "BCSE302L", name: "Database Systems", type: "TH", attendance: 55.0 },
        { code: "BCSE302P", name: "Database Systems Lab", type: "LO", attendance: 85.0 },
        { code: "BCSE303L", name: "Operating Systems", type: "TH", attendance: 53.0 },
        { code: "BCSE303P", name: "Operating Systems Lab", type: "LO", attendance: 93.0 },
        { code: "BCSE306L", name: "Artificial Intelligence", type: "TH", attendance: 44.0 },
        { code: "BCSE307L", name: "Compiler Design", type: "TH", attendance: 45.0 },
        { code: "BCSE307P", name: "Compiler Design Lab", type: "LO", attendance: 100.0 },
        { code: "BCSE308L", name: "Computer Networks", type: "TH", attendance: 40.0 },
        { code: "BCSE308P", name: "Computer Networks Lab", type: "LO", attendance: 100.0 },
        { code: "BCSE355L", name: "Cloud Architecture Design", type: "TH", attendance: 59.0 },
        { code: "BSTS301P", name: "Advanced Competitive Coding - I", type: "SS", attendance: 35.0 }
    ],

    // Days with no `events` render "--- No events scheduled ---"
    events: [
        { day: "22", month: "Oct-2026", label: "Today : Ongoing Events", events: [] },
        { day: "23", month: "Oct-2026", label: "Forthcoming Events", events: [] },
        { day: "24", month: "Oct-2026", events: [] },
        { day: "25", month: "Oct-2026", events: [] },
        {
            day: "26", month: "Oct-2026", events: [
                { title: "Race Analysis: United States GP", category: "Innovation", date: "2026-10-26", club: "Society Of Automotive Engineers (SAE)" }
            ]
        },
        {
            day: "27", month: "Oct-2026", events: [
                { title: "BREAKING THE CYCLE :A CASA REVOLUTION", category: "Social Awareness", date: "2026-10-27", club: "Entrepreneurship Cell (E-CELL)" },
                { title: "CASA: Drug Awareness", category: "Social Awareness", date: "2026-10-27", club: "Astronomy Club- Vit Stellar" },
                { title: "Full Circle", category: "Career Guidance", date: "2026-10-27", club: "Association For Computing Machinery (ACM)" }
            ]
        }
    ],

    spotlight: [
        {
            key: "Acad", label: "Academics", items: [
                { text: "Outcome Based Education (OBE) Handbook" },
                { text: "Watch for more information on Minors, Honors and Double Majors under ACE CURRICULUM !", href: "https://www.youtube.com/watch?v=Zn0aePvUVWM" }
            ]
        },
        {
            key: "Event", label: "Events", items: [
                { text: "EXTERNAL PARTICIPATION FORM" }
            ]
        },
        {
            key: "Academic", label: "Academic Research", items: [
                { text: "Coursework Syllabus", href: "https://drive.google.com/drive/folders/1ZAO3JJkXaB750HDSedt_rCnjmmbRDk1q?usp=sharing" },
                { text: "Standard Operating Procedure", href: "https://drive.google.com/drive/folders/1Ra6c2Pp95CqZwLN40YtLAi3IqnJfr7rj?usp=sharing" },
                { text: "Downloadable Formats for Students", href: "https://drive.google.com/drive/folders/1HlcIQ90q8xDkG87t7nSRcDEKmW0m8tJB?usp=sharing" }
            ]
        },
        {
            key: "SpoRIC", label: "SpoRIC", items: [
                { text: "Research Facility Portal - Charges for Internal User's" },
                { text: "Research Facility Portal - User Manual for Internal User's" }
            ]
        },
        {
            key: "Others", label: "Others", items: [
                { text: "Day Boarder & Day Scholar Application" },
                { text: "Hostel Vacating Consent Form For Projects/Interships" },
                { text: "Hostel Admission Request Form for Day Scholars" }
            ]
        }
    ],

    proctorMessage: "",

    credits: {
        required: "162",
        earned: "94.0",
        cgpa: "9.10",
        nonGradedCore: "9.0",
        placement: "Eligible For Placement"
    },

    digitalAssignments: [
        { course: "Compiler Design Lab", title: "Assessment - 10", lastDate: "28-10-2026" },
        { course: "Operating Systems Lab", title: "Assessment - 8 Midterm 2", lastDate: "24-10-2026" }
    ],

    feedbacks: [
        { title: "UG-Chancellor's Dinner &  Farewell Registration #Class of 2027", category: "Events", status: "Not Completed" },
        { title: "FEEDBACK FORM FOR EVALUATING CATERERS SWOT ANYALYS SEP- 2026", category: "General", status: "Completed" },
        { title: "Japanese Language Proficiency Detail for Placement", category: "General", status: "Completed" },
        { title: "OCI Details", category: "General", status: "Completed" },
        { title: "Software Usage Policy at VIT", category: "General", status: "Completed" }
    ]
};
