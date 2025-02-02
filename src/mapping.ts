import { 
    DelegatorAdded,
    DelegatorAddedNFT,
    DelegatorRegistered,
    DelegatorRemovalInitialized,
    DelegationEnded,
    UptimeUpdated,
    ValidationPeriodCreated,
    InitialValidatorCreated,
    ValidationPeriodRegistered,
    ValidatorRemovalInitialized,
    ValidationPeriodEnded,
    ValidatorWeightUpdate
} from '../generated/ERC721TokenStakingManager/ERC721TokenStakingManager'
import { 
    Validation,
    Delegation,
    DelegationNFT,
    UptimeUpdate,
    ValidatorWeight
} from '../generated/schema'

export function handleDelegatorAdded(event: DelegatorAdded): void {
    let entity = new Delegation(event.params.delegationID)

    entity.validationID = event.params.validationID
    entity.owner = event.params.delegatorAddress
    entity.weight = event.params.delegatorWeight
    entity.status = "PendingAdded"
    entity.save()
}

export function handleDelegatorNFTAdded(event: DelegatorAddedNFT): void {
    let entity = new DelegationNFT(event.params.delegationID)
  
    entity.validationID = event.params.validationID
    entity.owner = event.params.delegatorAddress
    entity.weight = event.params.delegatorWeight
    entity.status = "Active"
    // entity.startedAt = event.transaction.timestamp
    entity.tokenIDs = event.params.tokenIDs
    entity.save()
}

export function handleDelegatorRegistered(event: DelegatorRegistered): void {
    let entity = Delegation.load(event.params.delegationID)
    entity!.status = "Active"
    entity!.startedAt = event.params.startTime.toI64()
    entity!.save()
}

export function handleDelegatorRemovalInitialized(event: DelegatorRemovalInitialized): void {
    let entity = Delegation.load(event.params.delegationID)
    if (entity == null) {
        let e = DelegationNFT.load(event.params.delegationID)
        // e!.endedAt = event.transaction.timestamp
        e!.status = "PendingRemoved"
        e!.save()
    }
    
    entity!.status = "PendingRemoved"
    // entity.endedAt = event.transaction.timestamp
    entity!.save()
}

export function handleDelegationEnded(event: DelegationEnded): void {
    let entity = Delegation.load(event.params.delegationID)
    if (entity == null) {
        let e = DelegationNFT.load(event.params.delegationID)
        e!.status = "Removed"
        e!.save()
    }

    entity!.status = "Removed"
    entity!.save()
}

export function handleUptimeUpdated(event: UptimeUpdated): void {
    let entity = new UptimeUpdate(event.params.validationID.concatI32(event.params.epoch.toI32()))

    entity.validationID = event.params.validationID
    entity.uptimeSeconds = event.params.uptime
    entity.epoch = event.params.epoch
    entity.save()
}

export function handleValidationPeriodCreated(event: ValidationPeriodCreated): void {
    let entity = new Validation(event.params.validationID)

    entity.nodeID = event.params.nodeID
    entity.weight = event.params.weight
    entity.status = "PendingAdded"
    entity.save()
}

export function handleInitialValidatorCreated(event: InitialValidatorCreated): void {
    let entity = new Validation(event.params.validationID)

    entity.nodeID = event.params.nodeID
    entity.weight = event.params.weight
    entity.status = "Acitve"
    entity.save()
}

export function handleValidationPeriodRegistered(event: ValidationPeriodRegistered): void {
    let entity = new Validation(event.params.validationID)

    entity.startedAt = event.params.timestamp.toI64()
    entity.status = "Active"
    entity.save()
}

export function handleValidatorRemovalInitialized(event: ValidatorRemovalInitialized): void {
    let entity = new Validation(event.params.validationID)

    entity.endTime = event.params.endTime.toI64()
    entity.status = "PendingRemoved"
    entity.save()
}

export function handleValidationPeriodEnded(event: ValidationPeriodEnded): void {
    let entity = new Validation(event.params.validationID)

    entity.status = "Removed"
    entity.save()
}

export function handleValidatorWeightUpdate(event: ValidatorWeightUpdate): void {
    let entity = new ValidatorWeight(event.params.validationID)

    entity.weight = event.params.weight
    entity.save()
}
