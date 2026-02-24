
export function parsePartyHuntLog(logText) {
  const lines = logText.split('\n').map(line => line.trim());
  const players = [];
  
  // Helper to parse number string "1,234" -> 1234
  const parseNum = (str) => {
    if (!str) return 0;
    return Number(str.replace(/,/g, ''));
  };

  let currentPlayer = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect player name line (it usually precedes indented stats)
    // But how to distinguish "Looted Items:" from a player name?
    // Player names don't have ":" at the end usually.
    // And standard headers like "Session:", "Loot Type:", "Loot:", "Supplies:", "Balance:" have colons.
    
    if (line.includes(':') && !currentPlayer) {
        // Global stats or item stats, skip
        continue;
    } else if (line === '' || line === 'Killed Monsters:' || line === 'Looted Items:') {
        continue;
    } else if (!line.includes(':')) {
        // Potential player name
        // Check if next lines have "Balance:" or "Loot:" which confirms it's a player block
        let isPlayer = false;
        for(let j=1; j<=5; j++) {
            if (lines[i+j] && (lines[i+j].startsWith('Balance:') || lines[i+j].startsWith('Loot:') || lines[i+j].startsWith('Supplies:'))) {
                isPlayer = true;
                break;
            }
        }
        
        if (isPlayer) {
            if (currentPlayer) {
                players.push(currentPlayer);
            }
            currentPlayer = { name: line, loot: 0, supplies: 0, balance: 0, damage: 0, healing: 0 };
        }
    } else if (currentPlayer) {
        // Parsing stats for current player
        if (line.startsWith('Loot:')) currentPlayer.loot = parseNum(line.split(':')[1]);
        if (line.startsWith('Supplies:')) currentPlayer.supplies = parseNum(line.split(':')[1]);
        if (line.startsWith('Balance:')) currentPlayer.balance = parseNum(line.split(':')[1]);
        if (line.startsWith('Damage:')) currentPlayer.damage = parseNum(line.split(':')[1]);
        if (line.startsWith('Healing:')) currentPlayer.healing = parseNum(line.split(':')[1]);
    }
  }
  
  // Push last player
  if (currentPlayer) {
      players.push(currentPlayer);
  }

  return players;
}

export function calculatePartySplit(playersInput) {
    if (!playersInput || playersInput.length === 0) return null;
    
    // Clone to avoid mutating input directly if used in state
    let players = playersInput.map(p => ({...p}));

    // 1. Calculate Totals
    const totalLoot = players.reduce((sum, p) => sum + p.loot, 0);
    const totalSupplies = players.reduce((sum, p) => sum + p.supplies, 0);
    const totalBalance = players.reduce((sum, p) => sum + p.balance, 0);
    
    // 2. Profit per Player (Total Balance / N)
    const profitPerPlayer = Math.floor(totalBalance / players.length);

    // 3. Calculate Transfers
    // "Balance" = Loot - Supplies.
    // Each player wants to end up with (Supplies + ProfitPerPlayer) in their pocket.
    // Currenly they hold "Loot".
    // 
    // Transfer = (Target) - (Current)
    // Transfer = (Supplies + ProfitPerPlayer) - Loot
    // Transfer = Supplies + ProfitPerPlayer - (Supplies + Balance)
    // Transfer = ProfitPerPlayer - Balance.
    
    // If Transfer is POSITIVE: They need to RECEIVE money.
    // If Transfer is NEGATIVE: They need to PAY money.

    players.forEach(p => {
        p.amountToReceive = profitPerPlayer - p.balance;
    });

    const transfers = [];
    
    // Sort:
    // Receiver: amountToReceive > 0
    // Payer: amountToReceive < 0
    
    let payers = players.filter(p => p.amountToReceive < 0).sort((a,b) => a.amountToReceive - b.amountToReceive); // Most negative first
    let receivers = players.filter(p => p.amountToReceive > 0).sort((a,b) => b.amountToReceive - a.amountToReceive); // Most positive first

    let payerIndex = 0;
    let receiverIndex = 0;

    while (payerIndex < payers.length && receiverIndex < receivers.length) {
        let payer = payers[payerIndex];
        let receiver = receivers[receiverIndex];

        let amountToPay = Math.abs(payer.amountToReceive);
        let amountNeeded = receiver.amountToReceive;

        let transaction = Math.min(amountToPay, amountNeeded);
        
        if (transaction > 0) {
             transfers.push({
                from: payer.name,
                to: receiver.name,
                amount: Math.floor(transaction)
            });
        }
       
        // Update
        payer.amountToReceive += transaction;
        receiver.amountToReceive -= transaction;
        
        // Move indices
        if (Math.abs(payer.amountToReceive) < 1) payerIndex++;
        if (Math.abs(receiver.amountToReceive) < 1) receiverIndex++;
    }

    return {
        totalLoot,
        totalSupplies,
        totalBalance,
        profitPerPlayer,
        players,
        transfers
    };
}

export function calculateGoldGoal(targetGold, currentGold, days, hoursPerDay) {
  const remainingGold = Math.max(0, targetGold - currentGold);
  const goldPerDay = Math.ceil(remainingGold / days);
  const goldPerHour = Math.ceil(goldPerDay / hoursPerDay);

  return { remainingGold, goldPerDay, goldPerHour };
}

export function calculateHuntProfit(loot, supplies, balance) {
  // Usually Balance = Loot - Supplies. 
  // If user provides Balance directly, we use it. If not, we calculate.
  let profit = 0;
  if (balance !== null && balance !== undefined) {
      profit = balance;
  } else {
      profit = (loot || 0) - (supplies || 0);
  }
  return profit;
}

export function convertGoldToTibiacoins(goldAmount, tibiaCoinPriceGold) {
  if (!tibiaCoinPriceGold) return 0;
  return Math.floor(goldAmount / tibiaCoinPriceGold);
}

export function convertTibiacoinsToReal(tibiaCoinsAmount, tibiaCoinPriceReal) {
    // Usually sold in packs of 250, so price is often per 250 TC?
    // Let's assume price per 250 TC as standard in Brazil.
    if (!tibiaCoinPriceReal) return 0;
    // Price per 1 TC
    const pricePerTC = tibiaCoinPriceReal / 250;
    return (tibiaCoinsAmount * pricePerTC).toFixed(2);
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatGold(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'kk';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
