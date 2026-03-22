// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // 배포 시 컨트랙트 배포자에게 초기 물량 1,000,000 토큰 발행 (ERC20 기본 소수점 18자리 적용)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // 테스트 편의를 위해 누구나 토큰을 추가 발행할 수 있도록 열어둔 함수
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}