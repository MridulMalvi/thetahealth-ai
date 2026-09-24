import React, { createContext, useContext, useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth"

export type RoleType =
  | "NATIONAL_ADMIN"
  | "STATE_DISTRICT_ADMIN"
  | "HOSPITAL_ADMIN"
  | "PHC_WORKER"
  | "DOCTOR_NURSE"
  | "PHARMACIST"
  | "SUPPLY_CHAIN_MANAGER"
  | "EMERGENCY_OFFICER"
  | "ANALYST"

export interface UserPersona {
  role: RoleType
  title: string
  name: string
  email: string
  scope: string
  facilityName?: string
  districtName?: string
  stateName?: string
}

export const DEMO_PERSONAS: Record<RoleType, UserPersona> = {
  NATIONAL_ADMIN: {
    role: "NATIONAL_ADMIN",
    title: "National Administrator",
    name: "Dr. Aarti Sharma",
    email: "dr.aarti@thetahealth.gov",
    scope: "National (All 10 States & 400 Facilities)",
    stateName: "All States",
  },
  STATE_DISTRICT_ADMIN: {
    role: "STATE_DISTRICT_ADMIN",
    title: "District Health Officer",
    name: "Rajesh Varma",
    email: "rajesh.varma@up.gov.in",
    scope: "District Meerut (50 Facilities)",
    districtName: "Meerut",
    stateName: "Uttar Pradesh",
  },
  HOSPITAL_ADMIN: {
    role: "HOSPITAL_ADMIN",
    title: "Hospital Superintendent",
    name: "Dr. Sanjay Gupta",
    email: "sanjay.gupta@meerut-dh.gov.in",
    scope: "Facility (Meerut District Hospital)",
    facilityName: "District Hospital Meerut",
    districtName: "Meerut",
    stateName: "Uttar Pradesh",
  },
  PHC_WORKER: {
    role: "PHC_WORKER",
    title: "PHC Community Worker",
    name: "Sunita Devi",
    email: "sunita.devi@anandpur-phc.org",
    scope: "Facility (PHC Anandpur)",
    facilityName: "PHC Anandpur",
    districtName: "Meerut",
    stateName: "Uttar Pradesh",
  },
  DOCTOR_NURSE: {
    role: "DOCTOR_NURSE",
    title: "Medical Officer",
    name: "Dr. Priya Patel",
    email: "priya.patel@anandpur-phc.org",
    scope: "Clinical Ward (PHC Anandpur)",
    facilityName: "PHC Anandpur",
    districtName: "Meerut",
    stateName: "Uttar Pradesh",
  },
  PHARMACIST: {
    role: "PHARMACIST",
    title: "Chief Pharmacist",
    name: "Anil Deshmukh",
    email: "anil.d@meerut-dh.gov.in",
    scope: "Pharmacy Depot (Meerut District Hospital)",
    facilityName: "District Hospital Meerut",
    districtName: "Meerut",
    stateName: "Uttar Pradesh",
  },
  SUPPLY_CHAIN_MANAGER: {
    role: "SUPPLY_CHAIN_MANAGER",
    title: "Regional Logistics Officer",
    name: "Vikram Mehta",
    email: "vikram.mehta@supply.thetahealth.gov",
    scope: "Northern Corridor Logistics Depot",
    districtName: "Northern Regional Hub",
    stateName: "Uttar Pradesh",
  },
  EMERGENCY_OFFICER: {
    role: "EMERGENCY_OFFICER",
    title: "Emergency Response Commander",
    name: "Col. Raghav Singhania",
    email: "raghav.s@disaster.thetahealth.gov",
    scope: "Outbreak Response Team (Dengue Corridor)",
    stateName: "Uttar Pradesh",
  },
  ANALYST: {
    role: "ANALYST",
    title: "Public Health Epidemiologist",
    name: "Meera Krishnan",
    email: "meera.k@analytics.thetahealth.gov",
    scope: "Epidemiological Intelligence & Forecasting",
    stateName: "National",
  },
}

interface AuthContextType {
  currentUser: UserPersona
  firebaseUser: FirebaseUser | null
  loading: boolean
  isRoleModalOpen: boolean
  setIsRoleModalOpen: (open: boolean) => void
  switchRole: (role: RoleType) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserPersona>(() => {
    const saved = localStorage.getItem("theta_active_role") as RoleType
    return (saved && DEMO_PERSONAS[saved]) || DEMO_PERSONAS.NATIONAL_ADMIN
  })
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const switchRole = (role: RoleType) => {
    const persona = DEMO_PERSONAS[role]
    if (persona) {
      setCurrentUser(persona)
      localStorage.setItem("theta_active_role", role)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isRoleModalOpen,
        setIsRoleModalOpen,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
