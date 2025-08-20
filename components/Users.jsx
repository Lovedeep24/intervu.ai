"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { Toggle, GooeyFilter } from '@/components/ui/liquid-toggle'
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RouteAuthCheck from '@/lib/routeAuthCheck';

export default function Users() {
        const[users,setUsers]=useState([]);
        const [isLoading,setIsLoading]=useState(true);
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");
        const [sortColumn, setSortColumn] = useState("title");
        const [sortDirection, setSortDirection] = useState("asc");
      const filteredUsers = useMemo(() => {
        return users.filter((user) => 
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()));
       },[users, searchTerm]);
      const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
          if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
          if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      }, [filteredUsers, sortColumn, sortDirection]);
    
    
      const handleSort = (column) => {
        if (sortColumn === column) {
          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
          setSortColumn(column);
          setSortDirection("asc");
        }
    };
    
    const fetchUsers = async (token) => {
      try {
        const response = await axios.get("https://intervu-ai-beige.vercel.app/api/admin/getUser", {
          // const response = await axios.get("http://localhost:3000/api/admin/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        setUsers(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };    
   const handleSuspend = async (userId) => {
   const res = await axios.patch(`https://intervu-ai-beige.vercel.app/api/admin/suspendUser/${userId}`)
    // const res=await axios.patch(`http://localhost:3000/api/admin/suspendUser/${userId}`)
    if(res.status === 200)
    {
      toast.success("User Suspended Successfully")
      fetchUsers()
    }
    else{
      toast.error("Couldn't Suspend User! Try again")
    }
   }
   const handleUnsuspend = async (userId) => {
       const res = await axios.patch(`https://intervu-ai-beige.vercel.app/api/admin/unsuspendUser/${userId}`)
    // const res=await axios.patch(`http://localhost:3000/api/admin/unsuspendUser/${userId}`)
    if(res.status === 200)
    {
      toast.success("User Activated Successfully")
      fetchUsers()
    }
    else{
      toast.error("Couldn't Unsuspend User! Try again")
    }
   }

      function ToggleWithState({ variant, userId, isSuspended,}) {
        const [checked, setChecked] = useState(isSuspended)

        useEffect(() => {
          setChecked(isSuspended)
        }, [isSuspended])
      
        const handleToggle = (newChecked) => {
          setChecked(newChecked)
          if (newChecked) {
            
            handleSuspend(userId)
          } else {
            // Toggled OFF → unsuspend user
            handleUnsuspend(userId)
          }
        }
      
      
        return (
          <Toggle 
            variant={variant}
            checked={checked}
            onCheckedChange={handleToggle}
          />
        )
      }

    
    useEffect(() => {
      fetchUsers();
    },[]);
  return (
    <RouteAuthCheck userRole="admin">
    <div className='flex flex-col h-screen items-center '>
      <div className='flex items-center justify-between p-4 w-full h-12 mt-2'>
        <h1 className='text-3xl text-[#5862b2] font-bold'>Admin Portal</h1>
        <h1 className="text-3xl  font-semibold text-[#5862b2]">All Users</h1>
     <Image
          src="/intervuLogo2.png" 
          alt="Logo"
          className="h-8 w-auto overflow-hidden"
          width={100}
          height={40}
        /> 
     </div>
    <Toaster richColors position="top-center" />
     <div className=' w-full h-full flex flex-col items-center mt-2 '>
     {isLoading ? (<div className="mx-auto my-2 z-20 w-[95%]   max-w-8xl  rounded border">
           <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 md:py-2">
             <Skeleton className="h-6 w-40" /> {/* Test Cluster Title */}
             <Skeleton className="h-10 w-96" /> {/* Search Input */}
           </div>
     
           <div className="w-full">
             {/* Table Header Skeleton */}
             <div className="grid grid-cols-7 gap-5 border-b p-4">
               {Array(9).fill("").map((_, index) => (
                 <Skeleton key={index} className="h-6 w-24" />
               ))}
             </div>
     
             {/* Table Rows Skeleton */}
             <div className="space-y-4 p-4">
               {Array(5).fill("").map((_, rowIndex) => (
                 <div key={rowIndex} className="grid grid-cols-7 gap-2">
                   {Array(7).fill("").map((_, colIndex) => (
                     <Skeleton key={colIndex} className="h-6 w-24" />
                   ))}
                 </div>
               ))}
             </div>
           </div>
         </div>) :
         <div className="mx-auto  my-2 z-30 overflow-auto w-[95%]   max-w-8xl rounded border" >
         <div className="flex flex-wrap items-center justify-between p-4 md:py-2" >

           <Input
             placeholder="Search Users..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="md:w-96  border-2 " 
           />
         </div>
         <Table>
           <TableHeader>
           <TableRow >
               <TableHead
                 onClick={() => handleSort("userName")}
               >
                 Username
                 {sortColumn === "userName" && (
                   <span className="ml-1">
                     {sortDirection === "asc" ? "\u2191" : "\u2193"}
                   </span>
                 )}
               </TableHead>
               <TableHead
                 className="cursor-pointer"
                 onClick={() => handleSort("email")}
               >
                 Email
                 {sortColumn === "email" && (
                   <span className="ml-1">
                     {sortDirection === "asc" ? "\u2191" : "\u2193"}
                   </span>
                 )}
               </TableHead>
               <TableHead
                 className="cursor-pointer"
               >
                 Tests Attempted
               </TableHead>
          
               <TableHead
                 className="cursor-pointer text-nowrap"
                 onClick={() => handleSort("createdAt")}
               >
                 Singned up on
                 {sortColumn === "createdAt" && (
                   <span className="ml-1">
                     {sortDirection === "asc" ? "\u2191" : "\u2193"}
                   </span>
                 )}
               </TableHead>
               <TableHead>
                 Status
               </TableHead>
               <TableHead
                 className="cursor-pointer"
               >
                 Action
               </TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {sortedUsers.map((user) => (
                 <TableRow key={user._id} >
                 <TableCell className="font-medium">{user.userName}</TableCell>
                 <TableCell className="flex flex-wrap">
                     {user.email}
                  </TableCell>
                 <TableCell>{user.totalTest}</TableCell>
                 <TableCell>
                   {new Date(user.createdAt).toLocaleDateString("en-GB", {
                       day: "2-digit",
                       month: "2-digit",
                       year: "numeric",
                     })}
                 </TableCell>
                 <TableCell className="gap-2" >
                  <Badge variant="outline" className={user.isSuspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {user.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                  </TableCell>
                  <TableCell className="cursor-pointer">
                  <div className="relative">
                    <GooeyFilter />
                    <ToggleWithState  variant="danger" 
                      userId={user._id}
                      isSuspended={user.isSuspended}/>
                  </div>
                  </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>}
       </div>
       </div>
       </RouteAuthCheck>
  )
}
