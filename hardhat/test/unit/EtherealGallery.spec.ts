import { expect } from "chai"
import { deployments, ethers } from "hardhat"

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"

import { isLocalNetwork } from "../../helper-hardhat-config"
import {
    ErenYeager,
    EtherealGallery,
    PaymentDisabledContract,
    PaymentDisabledEtherealGalleryOwner,
} from "../../typechain"

!isLocalNetwork
    ? describe.skip
    : describe("EtherealGallery Unit Tests", function () {
          async function deployContractsFixture() {
              const [owner, otherAccount] = await ethers.getSigners()

              await deployments.fixture()

              const etherealGallery: EtherealGallery = await ethers.getContract(
                  "EtherealGallery",
                  owner
              )
              const erenYeager: ErenYeager = await ethers.getContract("ErenYeager", owner)
              const paymentDisabledContract: PaymentDisabledContract = await ethers.getContract(
                  "PaymentDisabledContract",
                  owner
              )
              await paymentDisabledContract.setContractAddresses(
                  etherealGallery.address,
                  erenYeager.address
              )
              const paymentDisabledEtherealGalleryOwner: PaymentDisabledEtherealGalleryOwner =
                  await ethers.getContract("PaymentDisabledEtherealGalleryOwner", owner)

              return {
                  etherealGallery,
                  erenYeager,
                  paymentDisabledContract,
                  paymentDisabledEtherealGalleryOwner,
                  owner,
                  otherAccount,
              }
          }

          async function approveAndListTokenFixture() {
              const { etherealGallery, erenYeager, owner, otherAccount } = await loadFixture(
                  deployContractsFixture
              )
              const sellPrice = ethers.utils.parseEther("1")
              const tokenId = (await erenYeager.tokenCounter()).sub(1)

              await erenYeager.approve(etherealGallery.address, tokenId)
              await etherealGallery.listToken(erenYeager.address, tokenId, sellPrice)

              return {
                  etherealGallery,
                  erenYeager,
                  tokenId,
                  sellPrice,
                  owner,
                  otherAccount,
              }
          }

          describe("Deployment", function () {
              it("Sets the right contract owner", async function () {
                  const { etherealGallery, owner } = await loadFixture(deployContractsFixture)

                  expect(await etherealGallery.owner()).to.equal(owner.address)
              })

              it("Sets the right owner balance", async function () {
                  const { etherealGallery } = await loadFixture(deployContractsFixture)
                  const expectedOwnerBalance = 0

                  expect(await etherealGallery.ownerBalance()).to.equal(expectedOwnerBalance)
              })
          })

          describe("List Token", function () {
              it("Reverts if the contract is not the token approver", async function () {
                  const { etherealGallery, erenYeager } = await loadFixture(deployContractsFixture)
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)

                  await expect(
                      etherealGallery.listToken(
                          erenYeager.address,
                          tokenId,
                          ethers.utils.parseEther("1")
                      )
                  ).to.be.revertedWithCustomError(
                      etherealGallery,
                      "EtherealGallery__MarketplaceNotApprover"
                  )
              })

              it("Reverts if the caller is not the token owner", async function () {
                  const { etherealGallery, erenYeager, otherAccount } = await loadFixture(
                      deployContractsFixture
                  )
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)
                  await erenYeager.approve(etherealGallery.address, tokenId)

                  await expect(
                      etherealGallery
                          .connect(otherAccount)
                          .listToken(erenYeager.address, tokenId, ethers.utils.parseEther("1"))
                  ).to.be.revertedWithCustomError(
                      etherealGallery,
                      "EtherealGallery__CallerNotTokenOwner"
                  )
              })

              it("Reverts if the price is zero", async function () {
                  const { etherealGallery, erenYeager } = await loadFixture(deployContractsFixture)
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)
                  await erenYeager.approve(etherealGallery.address, tokenId)

                  await expect(
                      etherealGallery.listToken(erenYeager.address, tokenId, 0)
                  ).to.be.revertedWithCustomError(etherealGallery, "EtherealGallery__PriceIsZero")
              })

              it("Adds token to listings", async function () {
                  const { etherealGallery, erenYeager, owner } = await loadFixture(
                      deployContractsFixture
                  )
                  const sellPrice = ethers.utils.parseEther("1")
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)
                  await erenYeager.approve(etherealGallery.address, tokenId)
                  const defaultUint = 0
                  const initialListing = await etherealGallery.tokenListing(
                      erenYeager.address,
                      tokenId
                  )
                  expect(initialListing.price).to.equal(defaultUint)
                  expect(initialListing.seller).to.equal(ethers.constants.AddressZero)

                  await etherealGallery.listToken(erenYeager.address, tokenId, sellPrice)

                  const listing = await etherealGallery.tokenListing(erenYeager.address, tokenId)
                  expect(listing.price).to.equal(sellPrice)
                  expect(listing.seller).to.equal(owner.address)
              })

              it("Emits the TokenListed event", async function () {
                  const { etherealGallery, erenYeager, owner } = await loadFixture(
                      deployContractsFixture
                  )
                  const sellPrice = ethers.utils.parseEther("1")
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)
                  await erenYeager.approve(etherealGallery.address, tokenId)

                  await expect(etherealGallery.listToken(erenYeager.address, tokenId, sellPrice))
                      .to.emit(etherealGallery, "TokenListed")
                      .withArgs(erenYeager.address, owner.address, sellPrice, tokenId)
              })
          })

          describe("Buy Token", function () {
              it("Reverts if the amount paid is less than the listing price", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice } = await loadFixture(
                      approveAndListTokenFixture
                  )
                  const lessThanSellPrice = sellPrice.sub(1)

                  await expect(
                      etherealGallery.buyToken(erenYeager.address, tokenId, {
                          value: lessThanSellPrice,
                      })
                  )
                      .to.be.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__ExactPriceNotMet"
                      )
                      .withArgs(lessThanSellPrice, sellPrice)
              })

              it("Reverts if the amount paid is more than the listing price", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice } = await loadFixture(
                      approveAndListTokenFixture
                  )
                  const moreThanSellPrice = sellPrice.add(1)

                  await expect(
                      etherealGallery.buyToken(erenYeager.address, tokenId, {
                          value: moreThanSellPrice,
                      })
                  )
                      .to.be.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__ExactPriceNotMet"
                      )
                      .withArgs(moreThanSellPrice, sellPrice)
              })

              it("Reverts if the token is not listed", async function () {
                  const { etherealGallery, erenYeager } = await loadFixture(deployContractsFixture)
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)
                  await erenYeager.approve(etherealGallery.address, tokenId)

                  await expect(
                      etherealGallery.buyToken(erenYeager.address, tokenId, {
                          value: ethers.utils.parseEther("1"),
                      })
                  )
                      .to.be.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__TokenNotListed"
                      )
                      .withArgs(erenYeager.address, tokenId)
              })

              it("Increments the owner balance by 2% of the selling price", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice } = await loadFixture(
                      approveAndListTokenFixture
                  )
                  const initialOwnerBalance = await etherealGallery.ownerBalance()

                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  const finalOwnerBalance = await etherealGallery.ownerBalance()
                  expect(finalOwnerBalance.sub(initialOwnerBalance)).to.equal(
                      sellPrice.mul(2).div(100)
                  )
              })

              it("Increments the seller's proceeds by 98% of the selling price", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  const initialSellerProceeds = await etherealGallery.proceeds(owner.address)

                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  const finalSellerProceeds = await etherealGallery.proceeds(owner.address)
                  expect(finalSellerProceeds.sub(initialSellerProceeds)).to.equal(
                      sellPrice.mul(98).div(100)
                  )
              })

              it("Deletes the token listing", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  const initialListing = await etherealGallery.tokenListing(
                      erenYeager.address,
                      tokenId
                  )
                  expect(initialListing.seller).to.equal(owner.address)
                  expect(initialListing.price).to.equal(sellPrice)
                  const defaultUint = 0

                  await etherealGallery.cancelTokenSale(erenYeager.address, tokenId)

                  const finalListing = await etherealGallery.tokenListing(
                      erenYeager.address,
                      tokenId
                  )
                  expect(finalListing.seller).to.equal(ethers.constants.AddressZero)
                  expect(finalListing.price).to.equal(defaultUint)
              })

              it("Transfers the token to the buyer", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner, otherAccount } =
                      await loadFixture(approveAndListTokenFixture)
                  const initialOwner = await erenYeager.ownerOf(tokenId)
                  expect(initialOwner).to.equal(owner.address)

                  await etherealGallery
                      .connect(otherAccount)
                      .buyToken(erenYeager.address, tokenId, {
                          value: sellPrice,
                      })

                  const finalOwner = await erenYeager.ownerOf(tokenId)
                  expect(finalOwner).to.equal(otherAccount.address)
              })

              it("Emits the TokenSold event", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, otherAccount } =
                      await loadFixture(approveAndListTokenFixture)

                  await expect(
                      etherealGallery.connect(otherAccount).buyToken(erenYeager.address, tokenId, {
                          value: sellPrice,
                      })
                  )
                      .to.emit(etherealGallery, "TokenSold")
                      .withArgs(erenYeager.address, otherAccount.address, sellPrice, tokenId)
              })
          })

          describe("Cancel Token Sale", function () {
              it("Reverts if the caller is neither the token owner or seller", async function () {
                  const { etherealGallery, erenYeager, otherAccount, tokenId } = await loadFixture(
                      approveAndListTokenFixture
                  )

                  await expect(
                      etherealGallery
                          .connect(otherAccount)
                          .cancelTokenSale(erenYeager.address, tokenId)
                  )
                      .to.be.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__CallerNotTokenOwner"
                      )
                      .withArgs(tokenId)
              })

              it("Deletes the token listing", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  const initialListing = await etherealGallery.tokenListing(
                      erenYeager.address,
                      tokenId
                  )
                  expect(initialListing.seller).to.equal(owner.address)
                  expect(initialListing.price).to.equal(sellPrice)

                  await etherealGallery.cancelTokenSale(erenYeager.address, tokenId)
              })

              it("Emits the TokenSaleCancelled event", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)

                  await expect(etherealGallery.cancelTokenSale(erenYeager.address, tokenId, {}))
                      .to.emit(etherealGallery, "TokenSaleCancelled")
                      .withArgs(erenYeager.address, owner.address, sellPrice, tokenId)
              })
          })

          describe("Withdraw Proceeds", function () {
              it("Reverts if caller has no proceeds", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, otherAccount } =
                      await loadFixture(approveAndListTokenFixture)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  await expect(
                      etherealGallery.connect(otherAccount).withdrawProceeds()
                  ).to.be.revertedWithCustomError(
                      etherealGallery,
                      "EtherealGallery__NoProceedsForCaller"
                  )
              })

              it("Resets proceeds of the caller", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })
                  const initialProceeds = await etherealGallery.proceeds(owner.address)
                  expect(initialProceeds).to.equal(sellPrice.mul(98).div(100))

                  await etherealGallery.withdrawProceeds()

                  const finalProceeds = await etherealGallery.proceeds(owner.address)
                  expect(finalProceeds).to.equal(0)
              })

              it("It pays caller their proceeds", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })
                  const proceeds = await etherealGallery.proceeds(owner.address)

                  await expect(etherealGallery.withdrawProceeds()).to.changeEtherBalances(
                      [owner, etherealGallery],
                      [proceeds, proceeds.mul(-1)]
                  )
              })

              it("Reverts if caller is not paid", async function () {
                  const { etherealGallery, erenYeager, paymentDisabledContract } =
                      await loadFixture(deployContractsFixture)
                  const sellPrice = ethers.utils.parseEther("1")
                  await paymentDisabledContract.listToken(sellPrice)
                  const tokenId = await paymentDisabledContract.tokenId()
                  expect(tokenId).to.equal(1)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  await expect(paymentDisabledContract.withdrawProceeds())
                      .to.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__WithdrawalFailed"
                      )
                      .withArgs(sellPrice.mul(98).div(100))
              })
          })

          describe("Withdraw Owner Balance", function () {
              it("Reverts if caller is not the owner", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, otherAccount } =
                      await loadFixture(approveAndListTokenFixture)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  await expect(
                      etherealGallery.connect(otherAccount).withdrawOwnerBalance()
                  ).to.be.revertedWith("Ownable: caller is not the owner")
              })

              it("Reverts if the owner has no balance", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice } = await loadFixture(
                      approveAndListTokenFixture
                  )
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })
                  await etherealGallery.withdrawOwnerBalance()

                  await expect(
                      etherealGallery.withdrawOwnerBalance()
                  ).to.be.revertedWithCustomError(
                      etherealGallery,
                      "EtherealGallery__NoBalanceForOwner"
                  )
              })

              it("Resets balance of the owner", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice } = await loadFixture(
                      approveAndListTokenFixture
                  )
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })
                  const initialBalance = await etherealGallery.ownerBalance()
                  expect(initialBalance).to.equal(sellPrice.mul(2).div(100))

                  await etherealGallery.withdrawOwnerBalance()

                  const finalBalance = await etherealGallery.ownerBalance()
                  expect(finalBalance).to.equal(0)
              })

              it("Pays owner their balance", async function () {
                  const { etherealGallery, erenYeager, tokenId, sellPrice, owner } =
                      await loadFixture(approveAndListTokenFixture)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })
                  const balance = await etherealGallery.ownerBalance()

                  await expect(etherealGallery.withdrawOwnerBalance()).to.changeEtherBalances(
                      [owner, etherealGallery],
                      [balance, balance.mul(-1)]
                  )
              })

              it("Reverts if owner is not paid", async function () {
                  const { erenYeager, paymentDisabledEtherealGalleryOwner, owner } =
                      await loadFixture(deployContractsFixture)
                  const etherealGalleryAddress =
                      await paymentDisabledEtherealGalleryOwner.etherealGallery()
                  const etherealGallery: EtherealGallery = await ethers.getContractAt(
                      "EtherealGallery",
                      etherealGalleryAddress,
                      owner
                  )
                  const sellPrice = ethers.utils.parseEther("1")
                  const tokenId = (await erenYeager.tokenCounter()).sub(1)

                  await erenYeager.approve(etherealGallery.address, tokenId)
                  await etherealGallery.listToken(erenYeager.address, tokenId, sellPrice)
                  await etherealGallery.buyToken(erenYeager.address, tokenId, {
                      value: sellPrice,
                  })

                  await expect(paymentDisabledEtherealGalleryOwner.withdrawOwnerBalance())
                      .to.revertedWithCustomError(
                          etherealGallery,
                          "EtherealGallery__WithdrawalFailed"
                      )
                      .withArgs(sellPrice.mul(2).div(100))
              })
          })
      })
