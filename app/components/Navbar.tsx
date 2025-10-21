"use client"; // 🔑 pour pouvoir utiliser useState, useEffect et hooks Clerk

import { UserButton, useUser } from "@clerk/nextjs";
import {  Building2, LayoutDashboard, ListTree, Menu, PackagePlus, Receipt, ShoppingBasket, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getUserRole, verifyUserClerkId } from "../action";
import router from "next/router";

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

    // Liens comptable dashboard/comptable/new-transaction
    const comptableLinks: NavLink[] = [
        { href: "/", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/comptable/transaction", label: "Mes Transactions", icon: Receipt },
        { href: "/dashboard/comptable/new-transaction", label: "Nouvelle Transaction", icon: PackagePlus },
    ];

    // Liens admin
    const adminLinks: NavLink[] = [
        { href: "/dashboard/admin", label: "Tableau de Bord", icon: LayoutDashboard },
        { href: "/dashboard/admin/category", label: "Catégories", icon: ListTree },
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

    useEffect(() => {
        async function checkUser() {
            const user = await verifyUserClerkId(); // pas besoin de paramètres
            if (!user) router.push("/maintenance");
        }
        checkUser();
    }, [router]);


    return (
        <nav className="w-full flex items-center justify-between border-gray-200 border-b pb-2 px-6">
            <div className="">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition">
                        <Building2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="font-bold text-lg tracking-wide text-gray-800 group-hover:text-primary transition">
                        CYBER <span className="text-primary">PGS</span>
                    </p>
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




































