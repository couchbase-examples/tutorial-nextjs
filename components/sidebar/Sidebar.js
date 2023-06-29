import React from 'react';
import {UserRow} from '../UserRow';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import SidebarLoader from '../loaders/SidebarLoader';

export const Sidebar = ({selectedProfile, setSelectedProfile, profiles, setProfiles, isLoading, setIsLoading, searchString, setSearchString, openCreateModal}) => {
  const handleSearchFieldChange = (event) => {
    setSearchString(event.target.value);
  }

  return (
      <div className={'bg-green-200 w-1/2 max-w-md max-h-[calc(100vh-4rem)] overflow-auto'}>
        <div className='p-4 mb-3'>
          <div className="flex place-items-center">
            <h2 className='flex-1 text-3xl text-gray-900 font-bold'>User Directory</h2>
            <span className='hover:cursor-pointer' onClick={openCreateModal}>
              <PlusCircleIcon className='h-8 w-8 text-blue-400 hover:text-blue-600'/>
            </span>
          </div>
          <div className="mt-4">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-500'/>
              </div>
              <input
                  onChange={handleSearchFieldChange}
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 py-1.5 pl-8 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search..."
              />
            </div>
          </div>
        </div>
        {
          isLoading ?
              <SidebarLoader numRecords={25}/>
              :
                profiles.length > 0 ?
                    <>
                      {
                        profiles
                            .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Sort the profiles alphabetically by name
                            .map((profile, idx) => {
                          // todo: correct href
                          return <UserRow profile={profile} index={idx} href={'#'} key={idx} setSelectedProfile={setSelectedProfile} isRowSelected={profile.pid === selectedProfile.pid}/>
                        })
                      }
                    </>
                    : <></>

        }
      </div>
  );
}
