import axios from 'axios'

import {unzipSync} from 'cross-zip'

import * as fs from 'fs'
import path = require('path')

export async function getMetaMaskReleases(version?: string) {
  let filename: string
  let downloadUrl: string

  const response = await axios.get('https://api.github.com/repos/metamask/metamask-extension/releases')
  if (version === 'latest' || !version) {
    filename = response.data[0].assets[0].name
    downloadUrl = response.data[0].assets[0].browser_download_url
  } else if (version) {
    filename = `metamask-chrome-${version}.zip`
    downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`
  }

  return {filename, downloadUrl}
}

export async function download(url: string, destination: string) {
  const writer = fs.createWriteStream(destination)
  const result = await axios({url, method: 'GET', responseType: 'stream'})
  await new Promise(resolve => result.data.pipe(writer).on('finish', resolve))
}

export function extract(file: string, destination: string) {
   unzipSync(file, destination)
}

export async function prepareMetaMask(version: string) {
  const release = await getMetaMaskReleases(version)
  const downloadsDirectory = path.resolve(__dirname, 'downloads')
  if (!fs.existsSync(downloadsDirectory)) {
    fs.mkdirSync(downloadsDirectory)
  }
  const downloadDestination = path.join(downloadsDirectory, release.filename)
  await download(release.downloadUrl, downloadDestination)
  const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
  extract(downloadDestination, metamaskDirectory);
  return metamaskDirectory
}