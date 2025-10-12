"use client"; // 🔑 pour pouvoir utiliser useState, useEffect et hooks Clerk

import { UserButton, useUser } from "@clerk/nextjs";
import { HandHeart, LayoutDashboard, ListTree, Menu, PackagePlus, Receipt, ShieldHalf, ShoppingBasket, Users, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getUserRole } from "../action";

type NavLink = {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
};

type Role = "ADMIN" | "COMPTABLE" | null;

const Navbar  = () => {
    const { user } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    
    const [ role, setRole] = useState<Role>(null);
    useEffect(() => {
        const fetchRole = async () => {
            const r = await getUserRole();
            setRole(r);
        };
        fetchRole();
    }, []);

    // Liens de base
    const baseLinks: NavLink[] = [
        { href: "/home", label: "Acceuil", icon: LayoutDashboard },
        
    ];

    // Liens comptable
    const comptableLinks: NavLink[] = [
        
        { href: "/transactions", label: "Mes Transactions", icon: Receipt },
        { href: "/transactions/nouvelle", label: "Nouvelle Transaction", icon: PackagePlus },
    ];

    // Liens admin
    const adminLinks: NavLink[] = [
        
        { href: "/dashboard/admin/categories", label: "Catégories", icon: ListTree },
        { href: "/dashboard/admin/users", label: "Utilisateurs", icon: Users }, // exemple
    ];

    // Fusion selon le rôle
    const navLinks: NavLink[] = [
        ...baseLinks,
        ...(role === "COMPTABLE" ? comptableLinks : []),
        ...(role === "ADMIN" ? adminLinks : []),
    ];

    const renderLinks = (baseClass: string) => (
        <>
            {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                const activeClass = isActive ? "bg-blue-500 text-white hover:text-black" : "btn-ghost";
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`${baseClass} ${activeClass} btn-sm flex items-center gap-2`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </Link>
                );
            })}
            
        </>
    );

    

    return (
        <nav className="w-full flex items-center justify-between border-gray-200 border-b pb-2 px-6">
            <div className="">
                <Link
                    href="/"
                    className="flex items-center bg-blue-500 gap-2 relative w-10 h-10 md:w-20 md:h-20"
                >
                    <Image
                        src="/logo.png"
                        alt="Cyber Pgs"
                        fill
                        className="object-contain"
                    />
                    
                </Link>

                

            </div>
            <div>
                <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-sm sm:hidden">
                    <Menu className="w-4 h-4" />
                </button>

                <div className="hidden space-x-2 sm:flex items-center">
                    {renderLinks("btn")}
                    <UserButton />
                </div>
            </div>
               
                
            

            {/* Menu responsive */}
            <div
                className={`absolute top-0 flex flex-col gap-2 p-4 ${menuOpen ? "left-0" : "-left-full"
                    } h-screen w-full bg-base-300 duration-300 transition-all sm:hidden z-50`}
            >
                <div className="flex justify-between">
                    <button onClick={() => setMenuOpen(false)} className="btn btn-sm sm:hidden">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex justify-end">
                    <UserButton />
                </div>
                
                {renderLinks("btn")}
            </div>

           
        </nav>
    );
};

export default Navbar;



































// import { UserButton } from "@clerk/nextjs"
// import Link from "next/link"
// import Image from "next/image"
// import { LayoutDashboard, PackagePlus, ShoppingBasket, ListTree, HandHeart, Receipt, Warehouse, Users } from "lucide-react"
// import { getUserRole } from "../action"

// export default async function Navbar() {
//     const role = await getUserRole() // ✅ Récupère directement depuis Prisma

//     const baseLinks = [
//         { href: "/", label: "Accueil", icon: LayoutDashboard },
//     ]

//     const comptableLinks = [
//         { href: "/transactions", label: "Mes Transactions", icon: Receipt },
//         { href: "/transactions/nouvelle", label: "Nouvelle Transaction", icon: PackagePlus },
//     ]

//     const adminLinks = [
//         { href: "/dashboard/admin/categories", label: "Catégories", icon: ListTree },
//         { href: "/dashboard/admin/users", label: "Utilisateurs", icon: Users },
//     ]

//     // Fusionne selon le rôle
//     const navLinks = [
//         ...baseLinks,
//         ...(role === "COMPTABLE" ? comptableLinks : []),
//         ...(role === "ADMIN" ? adminLinks : []),
//     ]

//     return (
//         <nav className="w-full flex items-center justify-between border-gray-200 border-b pb-4 px-6">
//             {/* LEFT */}
            // <Link href="/" className="flex items-center gap-2">
            //     <Image
            //         src="/logo.png"
            //         alt="TrendTheodore"
            //         width={36}
            //         height={36}
            //         className="w-6 h-6 md:w-9 md:h-9"
            //     />
            //     <p className="text-md font-medium tracking-wider hidden md:block">
            //         Cyber Pgs
            //     </p>
            // </Link>

//             {/* RIGHT */}
//             <div className="flex items-center gap-3">
//                 {navLinks.map(({ href, label, icon: Icon }) => (
//                     <Link
//                         key={href}
//                         href={href}
//                         className="btn btn-ghost btn-sm flex items-center gap-2"
//                     >
//                         <Icon className="w-4 h-4" />
//                         {label}
//                     </Link>
//                 ))}
//                 <UserButton afterSignOutUrl="/" />
//             </div>
//         </nav>
//     )
// }
