import React from 'react'
import MainLayout from '../layouts/MainLayout'
import Setting from '../components/setting/Setting'

function Settings() {
  return (
    <MainLayout>
      <div className="p-6">
        <Setting/>
      </div>
    </MainLayout>
  )
}

export default Settings
